from rest_framework import serializers
from .models import Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'description', 'price', 'interval',
                  'features', 'is_active', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=Plan.objects.filter(is_active=True),
        source='plan', write_only=True
    )

    class Meta:
        model = Subscription
        fields = ['id', 'plan', 'plan_id', 'status', 'current_period_start',
                  'current_period_end', 'cancel_at_period_end', 'created_at']
        read_only_fields = ['id', 'status', 'current_period_start',
                           'current_period_end', 'created_at']
