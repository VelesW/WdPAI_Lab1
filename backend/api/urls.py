from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', views.business_user_delete, name='user_list'),
    path('users/<int:pk>/', views.business_user_delete, name='user_delete'),
]