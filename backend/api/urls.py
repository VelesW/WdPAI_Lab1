from django.contrib import admin
from django.urls import path, include
from . import views

from .views import (
    business_user_list, business_user_delete,
    register, system_user_detail
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/', views.business_user_delete, name='user_list'),
    path('users/<int:pk>/', views.business_user_delete, name='user_delete'),
    path('register/', views.register, name='user_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]