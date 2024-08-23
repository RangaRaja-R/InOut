import jwt
from django.db import transaction
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from datetime import datetime, timezone, timedelta
from rest_framework_simplejwt.tokens import AccessToken
from .models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, EmployeeSerializer
from .utils import *

SECRET_KEY = "hello"


@api_view(['POST'])
@permission_classes([IsAdminUser])
def other_register(request):
    request.data['is_staff'] = True
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'user': serializer.data, 'message': 'success'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def register(request):
    try:
        with transaction.atomic():
            # Validate and save the user
            user_serializer = UserSerializer(data=request.data['user'])
            user_serializer.is_valid(raise_exception=True)
            user = user_serializer.save()

            # Create and save the location
            location_data = {
                'latitude': request.data['latitude'],
                'longitude': request.data['longitude']
            }
            location = Location.objects.create(**location_data)

            # Associate the user with the employee profile
            employee = Employee.objects.create(user=user, location=location)

        return Response({'message': 'success'}, status=status.HTTP_201_CREATED)

    except ValidationError as ve:
        return Response(ve.detail, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return Response({'message': 'failed'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = User.objects.filter(email=email).first()

    if user is None:
        return Response({'message': 'User not found'}, status=400)

    if not user.check_password(password):
        return Response({'message': 'Incorrect password'}, status=400)

    access_token = str(AccessToken.for_user(user))

    user.password = None
    serializer = UserSerializer(user)
    response = Response(serializer.data)
    response.set_cookie(key="jwt", value=access_token, httponly=True, samesite='None', secure=True)
    return response


@api_view(['POST'])
def logout(request):
    response = Response()
    response.data = {'message': 'success'}
    response.delete_cookie(key="jwt")
    return response


# returns the list of employees with their last attendance
@api_view(['GET'])
@permission_classes([IsAdminUser])
def employee_list(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    response = []
    for employee in serializer.data:
        last_attendance = Attendance.objects.filter(user=employee['id']).order_by('-check_in').first()
        if last_attendance:
            response.append({
                "id": employee['id'],
                "name": employee['user']['name'],
                "email": employee['user']['email'],
                "check_in": last_attendance.check_in,
                "check_out": last_attendance.check_out if last_attendance.check_out else None,
                "working_hours": last_attendance.work_hours if last_attendance.check_out else "Has not checked out",
            })
        else:
            response.append({
                "id": employee['id'],
                "name": employee['user']['name'],
                "email": employee['user']['email'],
                "check_in": None,
                "check_out": None,
                "working_hours": "-",
            })
    return Response(response)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_in(request):
    employee = Employee.objects.filter(user=request.user).first()
    current_loc = (request.data['latitude'], request.data['longitude'])

    if ((employee.offsite and employee.offsite.date == datetime.now(timezone.utc).date()
         and is_within_radius((employee.offsite.latitude, employee.offsite.longitude), current_loc)) or
            is_within_radius((employee.location.latitude, employee.location.longitude), current_loc)):
        attendance = Attendance.objects.create(
            user=employee,
            check_in=datetime.now(timezone.utc)
        )
        attendance.save()
        return Response({'message': "check-in successful"}, status=status.HTTP_200_OK)
    else:
        new_loc = Location()
        new_loc.latitude = current_loc[0]
        new_loc.longitude = current_loc[1]
        new_loc.save()
        employee.location = new_loc
        employee.save()
        return Response({'message': "location updated"}, status=status.HTTP_200_OK)
        # return Response({'message': "check-in failure"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out(request):
    employee = Employee.objects.filter(user=request.user).first()
    current_loc = (request.data['latitude'], request.data['longitude'])
    attendance = Attendance.objects.filter(user=employee, check_out__isnull=True).first()

    if attendance:
    # if attendance and not is_within_radius((employee.location.latitude, employee.location.longitude),
    #                                        current_loc):
        attendance.check_out = datetime.now(timezone.utc)
        work_hours = attendance.check_out - attendance.check_in
        attendance.work_hours = work_hours.total_seconds() / 3600.0
        attendance.save()
        return Response({'message': "check-out successful"}, status=status.HTTP_200_OK)
    else:
        if attendance:
            return Response({'message': "please exit location"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "no check in found"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def offsite(request):
    if not request.data['email']:
        return Response({'message': "email is required"}, status=status.HTTP_400_BAD_REQUEST)
    employee = Employee.objects.filter(user_id=request.data['email']).first()
    if employee is None:
        return Response({'message': 'User not found'}, status=400)
    offsite = Offsite()
    offsite.latitude = request.data['latitude']
    offsite.longitude = request.data['longitude']
    offsite.date = request.data['date']
    offsite.save()
    employee.offsite = offsite
    employee.save()
    return Response({'message': 'success'}, status=status.HTTP_200_OK)
