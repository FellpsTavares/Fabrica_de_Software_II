from django.urls import include, path
from . import views
from .views import cadastrar_usuario, cadastrar_local, cadastrar_familia, cadastrar_produto, cadastrar_membro_familiar, login_usuario

urlpatterns = [
    path('cadastrar_usuario/', cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar_local/', cadastrar_local, name='cadastrar_local'),
    path('cadastrar_familia/', cadastrar_familia, name='cadastrar_familia'),
    # path('cadastrar_pessoa_autorizada/', cadastrar_pessoa_autorizada, name='cadastrar_pessoa_autorizada'),
    path('cadastrar_produto/', cadastrar_produto, name='cadastrar_produto'),
    path('cadastrar_membro_familiar/', cadastrar_membro_familiar, name='cadastrar_membro_familiar'),
    path('login_usuario/', login_usuario, name='login_usuario'),
    path('cadastrar_movimentacao_estoque/', views.cadastrar_movimentacao_estoque, name='cadastrar_movimentacao_estoque'),
    path('cadastrar_distribuicao_produto/', views.cadastrar_distribuicao_produto, name='cadastrar_distribuicao_produto'),
    path('buscar_membro_por_cpf/', views.buscar_membro_por_cpf, name='buscar_membro_por_cpf'),
    path('listar_produtos/', views.listar_produtos, name='listar_produtos'),
    path('cadastrar_unidade_medida/', views.cadastrar_unidade_medida, name='cadastrar_unidade_medida'),
    path('listar_unidades_medida/', views.listar_unidades_medida, name='listar_unidades_medida'),
    path('excluir_unidade_medida/<int:id_unidade>/', views.excluir_unidade_medida, name='excluir_unidade_medida'),
    path('listar_movimentacoes_estoque/', views.listar_movimentacoes_estoque, name='listar_movimentacoes_estoque'),
]