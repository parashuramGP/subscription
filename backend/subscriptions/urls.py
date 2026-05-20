from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlanViewSet, SubscribeView, MySubscriptionsView,
    CancelSubscriptionView, PauseSubscriptionView, ResumeSubscriptionView,
)

router = DefaultRouter()
router.register(r'plans', PlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('my/', MySubscriptionsView.as_view(), name='my-subscriptions'),
    path('<str:sub_id>/cancel/', CancelSubscriptionView.as_view(), name='cancel-subscription'),
    path('<str:sub_id>/pause/', PauseSubscriptionView.as_view(), name='pause-subscription'),
    path('<str:sub_id>/resume/', ResumeSubscriptionView.as_view(), name='resume-subscription'),
]
