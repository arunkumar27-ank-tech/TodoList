from django.db.models import fields
from django.db.models.base import Model
from rest_framework import serializers
from todoapp.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'