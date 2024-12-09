from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import BusinessUser
from .serializers import BusinessUserSerializer
from .serializers import RegisterSerializer, SystemUserSerializer
from django.contrib.auth import get_user_model

SystemUser = get_user_model()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def business_user_list(request):
    """
    List all users or create a new user.
    GET: Returns a list of all users
    POST: Creates a new user
    """
    if request.method == 'GET':
        # Retrieve all users from the database
        users = BusinessUser.objects.all()
        # Serialize the queryset of users
        serializer = BusinessUserSerializer(users, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Create a new user from the request data
        serializer = BusinessUserSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new user if data is valid
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return validation errors if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def business_user_delete(request, pk):
    """
    Delete a user by primary key.
    DELETE: Removes the specified user from the database
    """
    try:
        # Attempt to find the user by primary key
        user = BusinessUser.objects.get(pk=pk)
    except BusinessUser.DoesNotExist:
        # Return 404 if user doesn't exist
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Delete the user and return success response
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
# @permission_classes([])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
def system_user_detail(request):
    pass


