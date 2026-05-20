from django.urls import path
from .views import WatchMovieView, WatchHistoryView

urlpatterns = [
    path('watch/', WatchMovieView.as_view(), name='watch-movie'),
    path('history/', WatchHistoryView.as_view(), name='watch-history'),
]
