# projeto_doacao/core/views.py
from django.http import JsonResponse
from .models import  Familia, LocalEntrega, Usuario # Certifique-se de ter um modelo Familia
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def cadastrar_familia(request):
    if request.method == "POST":
        data = json.loads(request.body)

        nome = data.get('nome')
        endereco = data.get('endereco')
        telefone = data.get('telefone')

        if not nome or not endereco or not telefone:
            return JsonResponse({'error': 'Todos os campos são obrigatórios'}, status=400)

        try:
            familia = Familia.objects.create(nome=nome, endereco=endereco, telefone=telefone)
            return JsonResponse({'message': 'Família cadastrada com sucesso!', 'id': familia.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def cadastrar_local(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nome = data.get('nome')
        endereco = data.get('endereco')
        telefone = data.get('telefone')

        if not nome or not endereco or not telefone:
            return JsonResponse({'error': 'Todos os campos são obrigatórios'}, status=400)

        try:
            local = LocalEntrega.objects.create(
                nome=nome,
                endereco=endereco,
                telefone=telefone
            )
            return JsonResponse({'message': 'Local cadastrado com sucesso!', 'id': local.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método não permitido'}, status=405) 

@csrf_exempt
def cadastrar_usuario(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    email    = data.get('email')
    tipo     = data.get('tipo', 'LOCAL')  # default LOCAL

    if not (username and password and email):
        return JsonResponse({'error': 'username, password e email são obrigatórios'}, status=400)

    try:
        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.tipo = tipo
        user.save()
        return JsonResponse({'message': 'Usuário cadastrado com sucesso!', 'id': user.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)