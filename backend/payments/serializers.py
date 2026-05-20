from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'subscription', 'stripe_payment_intent_id',
                  'amount', 'currency', 'status', 'payment_method',
                  'receipt_url', 'created_at']
        read_only_fields = ['stripe_payment_intent_id', 'status', 'receipt_url', 'created_at']
