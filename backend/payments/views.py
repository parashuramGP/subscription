from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from subscriptions.models import Plan
from subscriptions import storage as sub_storage
from accounts.views import get_user_from_token
from . import storage as pay_storage
from . import cards as card_storage


class ProcessPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        plan_id = request.data.get('plan_id')
        card_last4 = request.data.get('card_last4', '')
        card_type = request.data.get('card_type', 'card')
        card_name = request.data.get('card_name', '')
        expiry = request.data.get('expiry', '')
        save_card = request.data.get('save_card', False)

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

        payment = pay_storage.create_payment(
            user_id=user['id'],
            plan_data=plan_data,
            card_last4=card_last4,
            card_type=card_type,
            card_name=card_name,
        )

        sub_storage.create_subscription(user['id'], plan_data)

        if save_card and card_last4:
            card_storage.save_card(user['id'], card_last4, card_type, card_name, expiry)

        return Response({
            'message': f"Payment successful! Subscribed to {plan.name}.",
            'payment': payment,
        }, status=status.HTTP_201_CREATED)


class MyPaymentsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        payments = pay_storage.get_user_payments(user['id'])
        return Response(payments)


class SavedCardsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        cards = card_storage.get_user_cards(user['id'])
        return Response(cards)


class DeleteCardView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, card_id):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        card_storage.delete_card(card_id, user['id'])
        return Response({'message': 'Card removed.'})
