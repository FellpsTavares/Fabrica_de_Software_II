# core/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, LocalEntrega, Familia, MembroFamiliar
from django.db.models import Sum
import json

@csrf_exempt
def cadastrar_usuario(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    # Verificação de permissão de acesso
    usuario_autenticado = getattr(request, 'user', None)
    if not usuario_autenticado or not hasattr(usuario_autenticado, 'tipo_usuario'):
        return JsonResponse({'error': 'Usuário não autenticado'}, status=401)
    if usuario_autenticado.tipo_usuario not in ['MASTER', 'COORDENADOR']:
        return JsonResponse({'error': 'Acesso negado: apenas usuarios MASTER ou COORDENADOR podem cadastrar usuários.'}, status=403)

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
    endereco       = data.get('endereco')
    coordenador    = data.get('coordenador')
    telefone       = data.get('telefone')  # Opcional

    if not (nome and endereco and coordenador):
        return JsonResponse({'error': 'Todos os campos são obrigatórios'}, status=400)

    from .models import LocalEntrega
    if LocalEntrega.objects.filter(nome_local__iexact=nome).exists():
        return JsonResponse({'error': 'Já existe um local com esse nome.'}, status=400)

    try:
        local = LocalEntrega.objects.create(
            nome_local=nome,
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
        unidade_id = data.get('unidade_id')
        quantidade = data.get('quantidade', 0)
        usuario_id = data.get('usuario_id', 1)  # Padrão: 1 (ajuste para pegar do usuário logado)
        if not nome or not unidade_id:
            return JsonResponse({'error': 'Nome e unidade de medida são obrigatórios'}, status=400)
        from .models import Produto, UnidadeMedida, MovimentacaoEstoque, Usuario, Estoque
        try:
            unidade_medida = UnidadeMedida.objects.get(id_unidade=unidade_id)
        except UnidadeMedida.DoesNotExist:
            return JsonResponse({'error': 'Unidade de medida não encontrada'}, status=404)
        usuario = Usuario.objects.get(id=usuario_id)
        # Busca o estoque vinculado ao local do usuário
        estoque = Estoque.objects.filter(nome=usuario.local.nome_local).first()
        if not estoque:
            return JsonResponse({'error': 'Estoque não encontrado para o local do usuário'}, status=404)
        produto = Produto.objects.create(
            nome=nome,
            descricao=descricao,
            unidade_medida=unidade_medida,
            quantidade=quantidade,
            estoque=estoque  # Salva o estoque_id na tabela Produto
        )
        # Cria movimentação de estoque (entrada)
        MovimentacaoEstoque.objects.create(
            produto_id=produto.id_produto,
            usuario_id=usuario_id,
            tipo_movimentacao='entrada',
            quantidade=quantidade,
            estoque_destino_id=estoque.id_estoque,
            estoque_origem_id=None
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
        familia_id = data.get('familia_id')
        if not (nome and cpf and data_nascimento):
            return JsonResponse({'error': 'Todos os campos obrigatórios devem ser enviados'}, status=400)
        if familia_id:
            familia = Familia.objects.filter(id=familia_id).first()
        else:
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
        tipo_movimentacao = data.get('tipo_movimentacao')
        quantidade = data.get('quantidade')
        if not (produto_id and usuario_id and tipo_movimentacao and quantidade):
            return JsonResponse({'error': 'Campos obrigatórios faltando'}, status=400)
        usuario = Usuario.objects.get(id=usuario_id)
        # Busca o estoque vinculado ao local do usuário
        estoque = Estoque.objects.filter(nome=usuario.local.nome_local).first()
        if not estoque:
            return JsonResponse({'error': 'Estoque não encontrado para o local do usuário'}, status=404)
        estoque_origem_id = estoque.id_estoque if tipo_movimentacao == 'saida' else None
        estoque_destino_id = estoque.id_estoque if tipo_movimentacao == 'entrada' else None
        produto = Produto.objects.get(id_produto=produto_id)
        if tipo_movimentacao == 'saida':
            if float(quantidade) > float(produto.quantidade):
                return JsonResponse({'error': 'Quantidade insuficiente em estoque para saída!'}, status=400)
            produto.quantidade = float(produto.quantidade) - float(quantidade)
            produto.save()
        elif tipo_movimentacao == 'entrada':
            produto.quantidade = float(produto.quantidade) + float(quantidade)
            produto.save()
        movimentacao = MovimentacaoEstoque.objects.create(
            produto_id=produto_id,
            usuario_id=usuario_id,
            estoque_origem_id=estoque_origem_id,
            estoque_destino_id=estoque_destino_id,
            tipo_movimentacao=tipo_movimentacao,
            quantidade=quantidade
        )
        return JsonResponse({'message': 'Movimentação registrada com sucesso!', 'id': movimentacao.id_movimentacao}, status=201)
    except Produto.DoesNotExist:
        return JsonResponse({'error': 'Produto não encontrado'}, status=404)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuário não encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def cadastrar_distribuicao_produto(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        from .models import DistribuicaoProduto, MovimentacaoEstoque, Produto
        data = json.loads(request.body)
        membro_id = data.get('membro_id')
        estoque_id = data.get('estoque_id')
        usuario_id = data.get('usuario_id', 1)
        produto_id = data.get('produto_id')
        quantidade = data.get('quantidade')
        if not (produto_id and quantidade):
            return JsonResponse({'error': 'Produto e quantidade são obrigatórios'}, status=400)
        produto = Produto.objects.get(id_produto=produto_id)
        if float(quantidade) > float(produto.quantidade):
            return JsonResponse({'error': 'Quantidade insuficiente em estoque para doação!'}, status=400)
        # Atualiza o estoque do produto
        produto.quantidade = float(produto.quantidade) - float(quantidade)
        produto.save()
        distribuicao = DistribuicaoProduto.objects.create(
            membro_id=membro_id,
            estoque_id=estoque_id,
            usuario_id=usuario_id,
            produto_id=produto_id,
            quantidade=quantidade
        )
        MovimentacaoEstoque.objects.create(
            produto_id=produto_id,
            usuario_id=usuario_id,
            tipo_movimentacao='saida',
            quantidade=quantidade,
            estoque_origem_id=estoque_id,
            estoque_destino_id=None,
            membro_id=membro_id
        )
        return JsonResponse({'message': 'Distribuição registrada com sucesso!', 'id': distribuicao.id_distribuicao}, status=201)
    except Produto.DoesNotExist:
        return JsonResponse({'error': 'Produto não encontrado'}, status=404)
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
    estoque_id = request.GET.get('estoque_id')
    if estoque_id:
        produtos = Produto.objects.filter(estoque_id=estoque_id).values('id_produto', 'nome')
    else:
        produtos = Produto.objects.all().values('id_produto', 'nome')
    return JsonResponse(list(produtos), safe=False)

@csrf_exempt
def cadastrar_unidade_medida(request):
    from .models import UnidadeMedida
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        nome = data.get('nome')
        if not nome:
            return JsonResponse({'error': 'Nome da unidade é obrigatório'}, status=400)
        unidade, created = UnidadeMedida.objects.get_or_create(nome=nome)
        if created:
            return JsonResponse({'message': 'Unidade cadastrada com sucesso!', 'id': unidade.id_unidade}, status=201)
        else:
            return JsonResponse({'message': 'Unidade já existe!', 'id': unidade.id_unidade}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def listar_unidades_medida(request):
    from .models import UnidadeMedida
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    unidades = UnidadeMedida.objects.all().values('id_unidade', 'nome')
    return JsonResponse(list(unidades), safe=False)

@csrf_exempt
def excluir_unidade_medida(request, id_unidade):
    from .models import UnidadeMedida
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        unidade = UnidadeMedida.objects.get(pk=id_unidade)
        unidade.delete()
        return JsonResponse({'message': 'Unidade excluída com sucesso!'}, status=200)
    except UnidadeMedida.DoesNotExist:
        return JsonResponse({'error': 'Unidade não encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def listar_movimentacoes_estoque(request):
    from .models import MovimentacaoEstoque, Produto, Usuario, DistribuicaoProduto, MembroFamiliar, UnidadeMedida
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    movimentacoes = MovimentacaoEstoque.objects.select_related('produto__unidade_medida', 'usuario', 'estoque_origem', 'estoque_destino')
    entradas = []
    saidas = []
    for mov in movimentacoes:
        unidade_nome = mov.produto.unidade_medida.nome if mov.produto and mov.produto.unidade_medida else ''
        mov_dict = {
            'id_movimentacao': mov.id_movimentacao,
            'produto_nome': mov.produto.nome if mov.produto else '-',
            'usuario_nome': mov.usuario.nome_usuario if hasattr(mov.usuario, 'nome_usuario') else str(mov.usuario),
            'quantidade': float(mov.quantidade),
            'unidade_nome': unidade_nome,
            'data_movimentacao': mov.data_movimentacao,
            'tipo_movimentacao': mov.tipo_movimentacao,
            'membro_nome': None,
            'estoque_destino_id': mov.estoque_destino.id_estoque if mov.estoque_destino else None,
            'estoque_origem_id': mov.estoque_origem.id_estoque if mov.estoque_origem else None
        }
        if mov.tipo_movimentacao == 'entrada':
            entradas.append(mov_dict)
        else:
            membro_nome = None
            dist = DistribuicaoProduto.objects.filter(produto_id=mov.produto.id_produto, quantidade=mov.quantidade, usuario_id=mov.usuario.id).order_by('-data_distribuicao').first()
            if dist and dist.membro:
                membro_nome = dist.membro.nome
            mov_dict['membro_nome'] = membro_nome
            saidas.append(mov_dict)
    return JsonResponse({'entradas': entradas, 'saidas': saidas}, safe=False)

from .models import AutorizacaoRetirada

@csrf_exempt
def buscar_pessoa_por_cpf(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        cpf = data.get('cpf')
        if not cpf:
            return JsonResponse({'error': 'CPF não informado'}, status=400)
        membro = MembroFamiliar.objects.filter(cpf=cpf).first()
        if membro:
            familia = membro.familia
            return JsonResponse({'nome': membro.nome, 'familia': {'id_familia': familia.id, 'nome_familia': familia.nome_familia}}, status=200)
        else:
            return JsonResponse({'nome': '', 'familia': None}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def cadastrar_pessoa_autorizada(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        cpf = data.get('cpf')
        nome = data.get('nome')
        familia_id = data.get('familia_id')
        data_inicio = data.get('data_inicio')
        data_fim = data.get('data_fim')
        observacao = data.get('observacao', '')
        if not (cpf and nome and data_inicio):
            return JsonResponse({'error': 'CPF, nome e data de início são obrigatórios'}, status=400)
        familia = None
        membro = None
        familia_origem = None
        if familia_id:
            familia = Familia.objects.filter(id=familia_id).first()
        if cpf:
            membro = MembroFamiliar.objects.filter(cpf=cpf).first()
            if membro:
                familia_origem = membro.familia
        autorizacao = AutorizacaoRetirada.objects.create(
            membro=membro,  # Salva o membro se existir, senão None
            familia=familia,
            familia_origem=familia_origem,
            data_inicio=data_inicio,
            data_fim=data_fim if data_fim else None,
            motivo=observacao
        )
        return JsonResponse({'message': 'Pessoa autorizada cadastrada com sucesso!', 'id': autorizacao.id_autorizacao}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def buscar_familias(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    q = request.GET.get('q', '').strip()
    if len(q) < 3:
        return JsonResponse([], safe=False)
    familias = Familia.objects.filter(nome_familia__icontains=q).values('id', 'nome_familia')[:10]
    # Ajusta para id_familia no retorno
    result = [{'id_familia': f['id'], 'nome_familia': f['nome_familia']} for f in familias]
    return JsonResponse(result, safe=False)

@csrf_exempt
def listar_membros_familia(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    familia_id = request.GET.get('familia_id')
    if not familia_id:
        return JsonResponse({'error': 'ID da família não informado'}, status=400)
    membros = MembroFamiliar.objects.filter(familia_id=familia_id, motivo_exclusao__isnull=True).values('id_membro', 'nome', 'cpf', 'data_nascimento', 'pode_receber')
    return JsonResponse(list(membros), safe=False)

@csrf_exempt
def excluir_membro_familiar(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        id_membro = data.get('id_membro')
        motivo_exclusao = data.get('motivo_exclusao')
        membro = MembroFamiliar.objects.get(pk=id_membro)
        membro.motivo_exclusao = motivo_exclusao
        membro.save()
        return JsonResponse({'message': 'Membro excluído com sucesso!'}, status=200)
    except MembroFamiliar.DoesNotExist:
        return JsonResponse({'error': 'Membro não encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def tornar_apto_receber(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        id_membro = data.get('id_membro')
        membro = MembroFamiliar.objects.get(pk=id_membro)
        membro.pode_receber = True
        membro.save()
        return JsonResponse({'message': 'Membro agora pode receber doações!'}, status=200)
    except MembroFamiliar.DoesNotExist:
        return JsonResponse({'error': 'Membro não encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def editar_membro_familiar(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    try:
        data = json.loads(request.body)
        id_membro = data.get('id_membro')
        nome = data.get('nome')
        cpf = data.get('cpf')
        data_nascimento = data.get('data_nascimento')
        pode_receber = data.get('pode_receber', False)
        membro = MembroFamiliar.objects.get(pk=id_membro)
        membro.nome = nome
        membro.cpf = cpf
        membro.data_nascimento = data_nascimento
        membro.pode_receber = pode_receber
        # data_modificacao é atualizado automaticamente (auto_now=True)
        membro.save()
        return JsonResponse({'message': 'Membro atualizado com sucesso!'}, status=200)
    except MembroFamiliar.DoesNotExist:
        return JsonResponse({'error': 'Membro não encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def listar_locais(request):
    from .models import LocalEntrega
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    locais = LocalEntrega.objects.all().values('id', 'nome_local')
    # Ajusta para id_local_entrega no retorno
    result = [{'id_local_entrega': l['id'], 'nome_local': l['nome_local']} for l in locais]
    return JsonResponse(result, safe=False)

@csrf_exempt
def estoque_local(request):
    from .models import Estoque, Produto, UnidadeMedida, MovimentacaoEstoque
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    estoque_id = request.GET.get('estoque_id')
    if not estoque_id:
        return JsonResponse({'error': 'Estoque não informado'}, status=400)
    try:
        estoque = Estoque.objects.get(id_estoque=estoque_id)
    except Estoque.DoesNotExist:
        return JsonResponse({'error': 'Estoque não encontrado'}, status=404)
    produtos = Produto.objects.all()
    result = []
    for produto in produtos:
        entradas = MovimentacaoEstoque.objects.filter(produto=produto, estoque_destino=estoque, tipo_movimentacao='entrada').aggregate(Sum('quantidade'))['quantidade__sum'] or 0
        saidas = MovimentacaoEstoque.objects.filter(produto=produto, estoque_origem=estoque, tipo_movimentacao='saida').aggregate(Sum('quantidade'))['quantidade__sum'] or 0
        saldo = entradas - saidas
        if entradas > 0 or saidas > 0:
            result.append({
                'id_produto': produto.id_produto,
                'nome': produto.nome,
                'quantidade': float(saldo),
                'unidade_nome': produto.unidade_medida.nome
            })
    return JsonResponse(result, safe=False)

@csrf_exempt
def listar_estoques(request):
    from .models import Estoque
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    estoques = Estoque.objects.all().values('id_estoque', 'nome')
    return JsonResponse(list(estoques), safe=False)

@csrf_exempt
def usuario_detalhe(request, usuario_id):
    from .models import Usuario, LocalEntrega
    try:
        usuario = Usuario.objects.select_related('local').get(id=usuario_id)
        local = usuario.local
        return JsonResponse({
            'id': usuario.id,
            'nome': usuario.nome_usuario,
            'tipo': usuario.tipo_usuario,
            'local_id': local.id if local else None,
            'local_nome': local.nome_local if local else None
        })
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuário não encontrado'}, status=404)