from django.urls import path
from .api_razorpay import CreateOrderView

urlpatterns = [
    path('order/create/', CreateOrderView.as_view(), name='create_order-api'),
]
