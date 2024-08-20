from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from .models import User


class JWTAuthenticationFromCookie(BaseAuthentication):
    def authenticate(self, request):
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

        return (user, None)
