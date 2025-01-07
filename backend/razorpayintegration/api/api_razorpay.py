from rest_framework.views import APIView
from rest_framework import status
from .razorpay_serializers import CreateOrderSerializer
from rest_framework.response import Response
from razorpayintegration.api.razorpay.main import RazorpayClient

rz_clilent = RazorpayClient()


class CreateOrderView(APIView):
    def post(self, request):
        create_order_serializer = CreateOrderSerializer(data=request.data)
        if create_order_serializer.is_valid():
            order_response = rz_clilent.create_order(
                amount=create_order_serializer.validated_data["amount"],
                currency=create_order_serializer.validated_data["currency"]
            )
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "Order created successfully",
                "data": order_response
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "errors": create_order_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)