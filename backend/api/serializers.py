from rest_framework import serializers
from .models import BusinessUser, SystemUser

class BusinessUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = ['id', 'first_name', 'last_name', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUser
        firlds = ['id', 'username', 'email', 'role']

    def create(self, validated_data):
        user = SystemUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['passowrd']
        )
        return user

class SystemUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUser
        fields = ['id', 'email', 'password']

