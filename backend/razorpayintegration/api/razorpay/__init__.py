import razorpay
from django.conf import settings

client = razorpay.Client(auth=(settings.RAZORPAY_KAY_ID, settings.RAZORPAY_KAY_SECRET))

