import jwt
import datetime
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from . import storage


def generate_tokens(user_id):
    access_payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
        'type': 'access',
    }
    refresh_payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'type': 'refresh',
    }
    access = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
    refresh = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')
    return access, refresh


def get_user_from_token(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token = auth.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != 'access':
            return None
        return storage.get_user_by_id(payload['user_id'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email', '').strip()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')

        if not email or not username or not password:
            return Response({'error': 'Email, username and password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if password != password_confirm:
            return Response({'error': 'Passwords do not match.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = storage.create_user(
                email=email,
                username=username,
                password=password,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
            )
            return Response({'message': 'Account created successfully.', 'user': user},
                            status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        user = storage.authenticate(email, password)
        if not user:
            return Response({'error': 'Invalid email or password.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        access, refresh = generate_tokens(user['id'])
        return Response({
            'access': access,
            'refresh': refresh,
            'user': user,
        })


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh', '')
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != 'refresh':
                return Response({'error': 'Invalid token type.'}, status=status.HTTP_400_BAD_REQUEST)
            user = storage.get_user_by_id(payload['user_id'])
            if not user:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            access, refresh = generate_tokens(user['id'])
            return Response({'access': access, 'refresh': refresh})
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(user)

    def put(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        updated = storage.update_user(user['id'], request.data)
        return Response(updated)
