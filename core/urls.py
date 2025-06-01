from django.urls import include, path
from . import views
from .views import cadastrar_usuario, cadastrar_local, cadastrar_familia, cadastrar_pessoa_autorizada, cadastrar_produto, cadastrar_membro_familiar, login_usuario

urlpatterns = [
    path('cadastrar_usuario/', cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar_local/', cadastrar_local, name='cadastrar_local'),
    path('cadastrar_familia/', cadastrar_familia, name='cadastrar_familia'),
    # path('cadastrar_pessoa_autorizada/', cadastrar_pessoa_autorizada, name='cadastrar_pessoa_autorizada'),
    path('cadastrar_produto/', cadastrar_produto, name='cadastrar_produto'),
    path('cadastrar_membro_familiar/', cadastrar_membro_familiar, name='cadastrar_membro_familiar'),
    path('login_usuario/', login_usuario, name='login_usuario'),
]