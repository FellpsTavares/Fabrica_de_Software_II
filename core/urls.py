from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar_usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar_local/', views.cadastrar_local, name='cadastrar_local'),
    path('cadastrar_familia/', views.cadastrar_familia, name='cadastrar_familia'),
]