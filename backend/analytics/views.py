from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from subscriptions.models import Subscription
from payments.models import Payment
from orders.models import Order
from accounts.models import CustomUser


class DashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        now = timezone.now()
        last_30_days = now - timedelta(days=30)

        total_revenue = Payment.objects.filter(
            status='succeeded'
        ).aggregate(total=Sum('amount'))['total'] or 0

        monthly_revenue = Payment.objects.filter(
            status='succeeded', created_at__gte=last_30_days
        ).aggregate(total=Sum('amount'))['total'] or 0

        active_subscriptions = Subscription.objects.filter(status='active').count()
        total_users = CustomUser.objects.count()
        total_orders = Order.objects.count()

        new_users_30d = CustomUser.objects.filter(
            created_at__gte=last_30_days
        ).count()

        subscription_by_status = Subscription.objects.values('status').annotate(
            count=Count('id')
        )

        revenue_by_month = Payment.objects.filter(
            status='succeeded',
            created_at__gte=now - timedelta(days=180)
        ).extra(
            select={'month': "strftime('%%Y-%%m', created_at)"}
        ).values('month').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('month')

        return Response({
            'total_revenue': float(total_revenue),
            'monthly_revenue': float(monthly_revenue),
            'active_subscriptions': active_subscriptions,
            'total_users': total_users,
            'total_orders': total_orders,
            'new_users_30d': new_users_30d,
            'subscription_by_status': list(subscription_by_status),
            'revenue_by_month': list(revenue_by_month),
        })
