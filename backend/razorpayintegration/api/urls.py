from django.urls import path
from .api_razorpay import CreateOrderView, TransactionAPIView

urlpatterns = [
    path('order/create/', CreateOrderView.as_view(), name='create-order-api'),
    path('order/complete/', TransactionAPIView.as_view(), name='complete-order-api'),
]
