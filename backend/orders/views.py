from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.views import get_user_from_token
from . import storage


class WatchMovieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        movie = request.data.get('movie')
        if not movie or not movie.get('id'):
            return Response({'error': 'movie data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        entry = storage.add_to_history(user['id'], movie)
        return Response({'message': f"Now playing {movie.get('title', '')}", 'entry': entry},
                        status=status.HTTP_201_CREATED)


class WatchHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        history = storage.get_user_history(user['id'])
        return Response(history)
