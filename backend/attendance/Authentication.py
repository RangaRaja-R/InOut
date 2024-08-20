from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from .models import User


class JWTAuthenticationFromCookie(BaseAuthentication):
    def authenticate(self, request):
        if self.is_excluded_endpoint(request):
            return None, None
        # Retrieve the token from the cookies
        token = request.COOKIES.get('jwt')

        if not token:
            return None

        try:
            # Validate and decode the token
            validated_token = AccessToken(token)
            user = User.objects.get(id=validated_token['user_id'])
        except Exception as e:
            raise AuthenticationFailed('Invalid or expired token')

        return user, None

    def is_excluded_endpoint(self, request):
        # List of endpoints that do not require authentication
        print(request.path)
        excluded_endpoints = ['/logout', '/login', '/current/login']
        return request.path in excluded_endpoints

