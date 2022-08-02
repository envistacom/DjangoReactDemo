from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('1', index),
    path('2', index)
]