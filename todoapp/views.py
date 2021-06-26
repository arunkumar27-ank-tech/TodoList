from django.http import response
from django.shortcuts import render
from django.http.response import HttpResponse,JsonResponse
from rest_framework import serializers
from todoapp.models import Todo
from todoapp.serializers import TodoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


#function_view for displaying all records
@api_view(['GET'])
def read(request):
    task = Todo.objects.all()
    serializers = TodoSerializer(task, many=True)
    return JsonResponse(serializers.data, safe=False)

#function_view for accesing single element
@api_view(['GET'])
def read1(request,pk):
    task = Todo.objects.get(id=pk)
    serializers = TodoSerializer(task, many=False)
    return JsonResponse(serializers.data, safe=False)

#function_view for creating an element
@api_view(['POST'])
def produce(request):
    serializers = TodoSerializer(data=request.data)
    if serializers.is_valid():
        serializers.save()
    return JsonResponse(serializers.data, safe=False)

#function_view for ipdating an element
@api_view(['POST'])
def correct(request, pk):
    task = Todo.objects.get(id=pk)
    serializers = TodoSerializer(instance=task, data=request.data)
    if serializers.is_valid():
        serializers.save()
    return Response(serializers.data)
# Create your views here.

#function_view for deleting an element
@api_view(['DELETE'])
def abort(request,pk):
    task = Todo.objects.get(id=pk)
    task.delete()
    return Response('ITEM SUCCESSFULLY DELETED')
