from django.urls import path
from . import views

urlpatterns = [
    path('cadastrar-usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar-local/', views.cadastrar_local, name='cadastrar_local'),
    path('cadastrar-familia/', views.cadastrar_familia, name='cadastrar_familia'),
]
