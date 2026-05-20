from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Plan
from .serializers import PlanSerializer
from . import storage as sub_storage
from accounts.views import get_user_from_token


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]


class SubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Please login first.'}, status=status.HTTP_401_UNAUTHORIZED)

        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({'error': 'plan_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = Plan.objects.get(id=plan_id, is_active=True)
        except Plan.DoesNotExist:
            return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        plan_data = {
            'id': plan.id,
            'name': plan.name,
            'price': str(plan.price),
            'interval': plan.interval,
            'features': plan.features,
        }
        sub = sub_storage.create_subscription(user['id'], plan_data)
        return Response({'message': f"Subscribed to {plan.name}!", 'subscription': sub},
                        status=status.HTTP_201_CREATED)


class MySubscriptionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        subs = sub_storage.get_user_subscriptions(user['id'])
        return Response(subs)


class CancelSubscriptionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, sub_id):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        sub = sub_storage.cancel_subscription(sub_id, user['id'])
        if not sub:
            return Response({'error': 'Subscription not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Subscription cancelled.', 'subscription': sub})


class PauseSubscriptionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, sub_id):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        sub = sub_storage.pause_subscription(sub_id, user['id'])
        if not sub:
            return Response({'error': 'Subscription not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Subscription paused.', 'subscription': sub})


class ResumeSubscriptionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, sub_id):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        sub = sub_storage.resume_subscription(sub_id, user['id'])
        if not sub:
            return Response({'error': 'Subscription not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Subscription resumed.', 'subscription': sub})
