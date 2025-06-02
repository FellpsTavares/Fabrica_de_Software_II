# core/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, LocalEntrega, Familia, MembroFamiliar
import json

@csrf_exempt
def cadastrar_usuario(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    nome    = data.get('nome_usuario')
    login   = data.get('username')
    senha   = data.get('senha')
    email   = data.get('email')
    tipo    = data.get('tipo_usuario', 'OPERACAO')
    nome_local = data.get('nome_local')

    if not (nome and login and senha and email and nome_local):
        return JsonResponse({'error': 'nome_usuario, username, senha, email e nome_local são obrigatórios'}, status=400)

    try:
        # Busca local por nome (case insensitive, contém)
        local = LocalEntrega.objects.filter(nome_local__icontains=nome_local).first()
        if not local:
            return JsonResponse({'error': 'Local de retirada não encontrado'}, status=404)
        user = Usuario.objects.create_user(
            username=login,
            email=email,
            password=senha,
            local=local
        )
        user.nome_usuario = nome
        user.tipo_usuario = tipo
        user.save()
        return JsonResponse({'message': 'Usuário cadastrado com sucesso!', 'id': user.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def cadastrar_local(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    nome           = data.get('nome_local')
    funcionarios   = data.get('funcionarios')
    endereco       = data.get('endereco')
    coordenador    = data.get('coordenador')
    telefone       = data.get('telefone')  # Opcional

    if not (nome and funcionarios and endereco and coordenador):
        return JsonResponse({'error': 'Todos os campos são obrigatórios'}, status=400)

    try:
        local = LocalEntrega.objects.create(
            nome_local=nome,
            funcionarios=funcionarios,
            endereco=endereco,
            coordenador=coordenador,
            telefone=telefone if telefone else ''
        )
        return JsonResponse({'message': 'Local de entrega cadastrado com sucesso!', 'id': local.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def cadastrar_familia(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    campos = ['nome_familia','endereco',
              'tipo_recebimento','renda_familia','quantidade_integrantes',
              'tipo_moradia']
    if not all(data.get(c) for c in campos):
        return JsonResponse({'error': 'Todos os campos obrigatórios devem ser enviados'}, status=400)

    try:
        familia = Familia.objects.create(
            nome_familia           = data['nome_familia'],
            endereco               = data['endereco'],
            tipo_recebimento       = data.get('tipo_recebimento','estipulado'),
            renda_familia          = data['renda_familia'],
            quantidade_integrantes = data['quantidade_integrantes'],
            tipo_moradia           = data['tipo_moradia'],
            status                 = data.get('status','ativo'),
        )
        return JsonResponse({'message': 'Família cadastrada com sucesso!', 'id': familia.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
@csrf_exempt

def cadastrar_produto(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        nome = data.get('nome')
        descricao = data.get('descricao', '')
        unidade_medida = data.get('unidade_medida')

        if not nome or not unidade_medida:
            return JsonResponse({'error': 'Nome e unidade de medida são obrigatórios'}, status=400)

        from .models import Produto
        produto = Produto.objects.create(
            nome=nome,
            descricao=descricao,
            unidade_medida=unidade_medida
        )
        return JsonResponse({'message': 'Produto cadastrado com sucesso!', 'id': produto.id_produto}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def cadastrar_membro_familiar(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        nome = data.get('nome')
        cpf = data.get('cpf')
        data_nascimento = data.get('data_nascimento')
        pode_receber = data.get('pode_receber', False)

        if not (nome and cpf and data_nascimento):
            return JsonResponse({'error': 'Todos os campos obrigatórios devem ser enviados'}, status=400)

        # Busca a última família cadastrada
        familia = Familia.objects.order_by('-id').first()
        if not familia:
            return JsonResponse({'error': 'Nenhuma família cadastrada'}, status=404)

        from .models import MembroFamiliar
        membro = MembroFamiliar.objects.create(
            nome=nome,
            cpf=cpf,
            data_nascimento=data_nascimento,
            familia=familia,
            pode_receber=bool(pode_receber)
        )
        return JsonResponse({'message': 'Membro cadastrado com sucesso!', 'id': membro.id_membro}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def login_usuario(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return JsonResponse({'error': 'Usuário e senha são obrigatórios'}, status=400)
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({'message': 'Login realizado com sucesso!', 'id': user.id, 'nome': user.nome_usuario, 'tipo': user.tipo_usuario}, status=200)
        else:
            return JsonResponse({'error': 'Usuário ou senha inválidos'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def cadastrar_movimentacao_estoque(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        from .models import MovimentacaoEstoque, Produto, Usuario, Estoque
        data = json.loads(request.body)
        produto_id = data.get('produto_id')
        usuario_id = data.get('usuario_id')
        estoque_origem_id = data.get('estoque_origem_id')
        estoque_destino_id = data.get('estoque_destino_id')
        tipo_movimentacao = data.get('tipo_movimentacao')
        quantidade = data.get('quantidade')
        if not (produto_id and usuario_id and tipo_movimentacao and quantidade):
            return JsonResponse({'error': 'Campos obrigatórios faltando'}, status=400)
        movimentacao = MovimentacaoEstoque.objects.create(
            produto_id=produto_id,
            usuario_id=usuario_id,
            estoque_origem_id=estoque_origem_id,
            estoque_destino_id=estoque_destino_id,
            tipo_movimentacao=tipo_movimentacao,
            quantidade=quantidade
        )
        return JsonResponse({'message': 'Movimentação registrada com sucesso!', 'id': movimentacao.id_movimentacao}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def cadastrar_distribuicao_produto(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        from .models import DistribuicaoProduto, MembroFamiliar, Estoque, Usuario, Produto
        data = json.loads(request.body)
        membro_id = data.get('membro_id')
        estoque_id = data.get('estoque_id')
        usuario_id = data.get('usuario_id')
        produto_id = data.get('produto_id')
        quantidade = data.get('quantidade')
        # if not (membro_id and estoque_id and usuario_id and produto_id and quantidade):
        #     return JsonResponse({'error': 'Campos obrigatórios faltando'}, status=400)
        distribuicao = DistribuicaoProduto.objects.create(
            membro_id=membro_id,
            estoque_id=estoque_id,
            usuario_id=usuario_id,
            produto_id=produto_id,
            quantidade=quantidade
        )
        return JsonResponse({'message': 'Distribuição registrada com sucesso!', 'id': distribuicao.id_distribuicao}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def buscar_membro_por_cpf(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        cpf = data.get('cpf')
        if not cpf:
            return JsonResponse({'error': 'CPF não informado'}, status=400)
        membro = MembroFamiliar.objects.filter(cpf=cpf, pode_receber=True).first()
        if not membro:
            return JsonResponse({'error': 'CPF não encontrado ou não autorizado'}, status=404)
        return JsonResponse({'id_membro': membro.id_membro, 'nome': membro.nome}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def listar_produtos(request):
    from .models import Produto
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    produtos = Produto.objects.all().values('id_produto', 'nome')
    return JsonResponse(list(produtos), safe=False)