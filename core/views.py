# core/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, LocalEntrega, Familia, PessoaAutorizada
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

    if not (nome and login and senha and email):
        return JsonResponse({'error': 'nome_usuario, username, senha e email são obrigatórios'}, status=400)

    try:
        user = Usuario.objects.create_user(
            username=login,
            email=email,
            password=senha,
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
            coordenador=coordenador
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
def cadastrar_pessoa_autorizada(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        familia_id = data.get('familia_id')  
        nome = data.get('nome')
        cpf = data.get('cpf')
        telefone = data.get('telefone', '')  

        # Validações básicas
        if not nome:
            return JsonResponse({'error': 'Nome é obrigatório'}, status=400)
        if not cpf:
            return JsonResponse({'error': 'CPF é obrigatório'}, status=400)

        # Busca a família: se não vier familia_id, pega a última cadastrada
        familia = None
        if familia_id:
            try:
                familia = Familia.objects.get(pk=familia_id)
            except Familia.DoesNotExist:
                return JsonResponse({'error': 'Família não encontrada'}, status=404)
        else:
            familia = Familia.objects.order_by('-id').first()
            if not familia:
                return JsonResponse({'error': 'Nenhuma família cadastrada'}, status=404)

        # Verifica se já existe pessoa com mesmo CPF na família
        if PessoaAutorizada.objects.filter(cpf=cpf, familia=familia).exists():
            return JsonResponse({
                'error': f'Já existe uma pessoa com CPF {cpf} '
                        f'na família {familia.id if familia else "padrão"}'
            }, status=400)

        # Cria a pessoa
        pessoa = PessoaAutorizada.objects.create(
            nome=nome,
            cpf=cpf,
            telefone=telefone,
            familia=familia
        )

        return JsonResponse({
            'message': 'Pessoa cadastrada com sucesso!',
            'id': pessoa.id_pessoa_autorizada,
            'cpf': pessoa.cpf,
            'familia_id': pessoa.familia_id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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