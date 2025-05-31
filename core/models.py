from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('MASTER', 'Master'),
        ('COORDENADOR', 'Coordenador'),
        ('OPERACAO', 'Operacional'),
    )
    # força o Django a usar o campo `id_usuario` no banco como seu `id` interno
    id = models.AutoField(primary_key=True, db_column='id_usuario')

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

class PessoaAutorizada(models.Model):
    id_pessoa_autorizada = models.AutoField(
        primary_key=True,
        db_column='id_pessoa_autorizada'
    )
    nome     = models.CharField(max_length=100)
    cpf      = models.CharField(max_length=14)
    telefone = models.CharField(max_length=30, null=True, blank=True)
    familia = models.ForeignKey(Familia, on_delete=models.CASCADE, related_name='pessoas_autorizadas')

    class Meta:
        db_table = 'pessoa_autorizada'
        unique_together = ('cpf', 'familia')