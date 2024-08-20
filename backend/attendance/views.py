import jwt
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timezone, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, EmployeeSerializer
from .utils import *


SECRET_KEY = "hello"


@api_view(['POST'])
def other_register(request):
    request.data['is_staff'] = True
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'user': serializer.data, 'message': 'success'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data['user'])
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    try:
        location = Location().objects.create(
            latitude=request.data['latitude'],
            longitude=request.data['longitude']
        )
        location.save()
        employee = Employee().objects.create(
            user=User.objects.filter(email=request.data['user']['email']).first(),
            location=location
        )
        employee.save()
    except Exception as e:
        print(e)
        return Response({'message': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'success'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = User.objects.filter(email=email).first()

    if user is None:
        return Response({'message': 'User not found'}, status=400)

    if not user.check_password(password):
        return Response({'message': 'Incorrect password'}, status=400)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

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


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def all(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


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
        return Response({'message': "check-in failure"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out(request):
    employee = Employee.objects.filter(user=request.user).first()
    current_loc = (request.data['latitude'], request.data['longitude'])
    attendance = Attendance.objects.filter(user=employee, check_out__isnull=True).first()

    if attendance and not is_within_radius((employee.location.latitude, employee.location.longitude),
                                           current_loc):

        attendance.check_out = datetime.now(timezone.utc)
        work_hours = attendance.check_out - attendance.check_in
        attendance.work_hours = work_hours.total_seconds() / 3600.0
        attendance.save()
        return Response({'message': "check-out successful"}, status=status.HTTP_200_OK)
    else:
        if attendance:
            print("loc")
        else:
            print("attend")
        return Response({'message': "check-out successful"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
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
