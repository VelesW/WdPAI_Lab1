from django.contrib import admin
from .models import BusinessUser, SystemUser

# Register your models here.
admin.site.register(SystemUser)
admin.site.register(BusinessUser)
