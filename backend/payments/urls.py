from django.urls import path
from .views import ProcessPaymentView, MyPaymentsView, SavedCardsView, DeleteCardView

urlpatterns = [
    path('pay/', ProcessPaymentView.as_view(), name='process-payment'),
    path('my/', MyPaymentsView.as_view(), name='my-payments'),
    path('cards/', SavedCardsView.as_view(), name='saved-cards'),
    path('cards/<str:card_id>/', DeleteCardView.as_view(), name='delete-card'),
]
