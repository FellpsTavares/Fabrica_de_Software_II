from django.urls import include, path
from . import views
from .views import cadastrar_usuario, cadastrar_local, cadastrar_familia, cadastrar_pessoa_autorizada, cadastrar_produto

urlpatterns = [
    path('cadastrar_usuario/', cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar_local/', cadastrar_local, name='cadastrar_local'),
    path('cadastrar_familia/', cadastrar_familia, name='cadastrar_familia'),
    path('cadastrar_pessoa_autorizada/', cadastrar_pessoa_autorizada, name='cadastrar_pessoa_autorizada'),
    path('cadastrar_produto/', cadastrar_produto, name='cadastrar_produto'),
]