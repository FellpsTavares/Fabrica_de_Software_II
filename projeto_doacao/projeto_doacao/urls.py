
from django.urls import path
from app_cadastro_usuarios import views

urlpatterns = [
    # rota, view responsavel, nome de referencia
    # doacao.com
    path('', views.home, name='home'),
    # doacao.com/cadastro
    #path('cadastro/')
]