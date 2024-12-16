from django.contrib import admin
from django.urls import path, include
from .views import (
    business_user_list, business_user_delete,
    register,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/', business_user_list, name='business_user_list'),
    path('users/<int:pk>/', business_user_delete, name='user_delete'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register'),
]