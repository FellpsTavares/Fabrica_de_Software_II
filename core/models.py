from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('MASTER', 'Master'),
        ('COORDENADOR', 'Coordenador'),
        ('OPERACAO', 'Operacional'),
    )
    id = models.AutoField(primary_key=True)  # Removido db_column='id_usuario'

    nome_usuario = models.CharField("Nome", max_length=80)
    username = models.CharField("Login", max_length=20, unique=True)
    email = models.EmailField("E-mail", max_length=50, unique=True)
    tipo_usuario = models.CharField(
        "Tipo", max_length=20, choices=TIPO_CHOICES, default='OPERACAO'
    )

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

class LocalEntrega(models.Model):
    nome_local = models.CharField("Nome do Local", max_length=50)
    funcionarios = models.CharField("Funcionários", max_length=150)
    endereco = models.CharField("Endereço", max_length=150)
    coordenador = models.CharField("Coordenador", max_length=80)
    telefone = models.CharField("Telefone", max_length=20,null=True, blank=True)

    class Meta:
        db_table = 'local'
        verbose_name = 'Local de Entrega'
        verbose_name_plural = 'Locais de Entrega'

    def __str__(self):
        return self.nome_local

class Familia(models.Model):
      # sobrescreve a pk-padrão para usar id_familia
    id = models.AutoField(
        primary_key=True,
        db_column='id_familia'
    )

    TIPO_RECEBIMENTO_CHOICES = (
        ('estipulado', 'Estipulado'),
        ('nao_estipulado', 'Não Estipulado'),
    )
    STATUS_CHOICES = (
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('bloqueado', 'Bloqueado'),
    )

    nome_familia = models.CharField("Nome da Família", max_length=100)
    endereco = models.CharField("Endereço", max_length=150)
    tipo_recebimento = models.CharField(
        "Tipo Recebimento", max_length=20,
        choices=TIPO_RECEBIMENTO_CHOICES, default='estipulado'
    )
    renda_familia = models.DecimalField(
        "Renda da Família", max_digits=12, decimal_places=2
    )
    quantidade_integrantes = models.PositiveIntegerField("Qtd. Membros")
    tipo_moradia = models.CharField("Moradia", max_length=50)
    data_atualizacao = models.DateField("Atualização", auto_now=True)
    status = models.CharField(
        "Status", max_length=10, choices=STATUS_CHOICES, default='ativo'
    )

    class Meta:
        db_table = 'familia'
        verbose_name = 'Família'
        verbose_name_plural = 'Famílias'

    def __str__(self):
        return self.nome_familia

class MembroFamiliar(models.Model):
    id_membro = models.AutoField(primary_key=True, db_column='id_membro')
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14)
    data_nascimento = models.DateField()
    familia = models.ForeignKey(Familia, on_delete=models.CASCADE, related_name='membros')
    pode_receber = models.BooleanField(default=False)

    class Meta:
        db_table = 'membro_familiar'
        verbose_name = 'Membro Familiar'
        verbose_name_plural = 'Membros Familiares'
        unique_together = ('cpf', 'familia')

    def __str__(self):
        return self.nome

class Produto(models.Model):
    id_produto = models.AutoField(primary_key=True, db_column='id_produto')
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    unidade_medida = models.CharField(max_length=20)

    class Meta:
        db_table = 'produto'
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return self.nome