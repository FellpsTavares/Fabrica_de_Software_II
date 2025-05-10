# core/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('MASTER',       'Master'),
        ('COORDENADOR',  'Coordenador'),
        ('OPERACAO',     'Operacional'),
    )
    nome_usuario    = models.CharField("Nome",    max_length=80)
    username        = models.CharField("Login",   max_length=20, unique=True)
    # password já vem de AbstractUser e guarda o hash (até 128 chars)
    email           = models.EmailField("E-mail", max_length=50, unique=True)
    tipo_usuario    = models.CharField("Tipo",    max_length=20, choices=TIPO_CHOICES, default='OPERACAO')

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

# core/models.py (continuação)

class LocalEntrega(models.Model):
    nome_local      = models.CharField("Nome do Local",   max_length=50)
    funcionarios    = models.CharField("Funcionários",    max_length=150)
    endereco        = models.CharField("Endereço",        max_length=150)
    coordenador     = models.CharField("Coordenador",     max_length=80)
    telefone        = models.CharField("Telefone",        max_length=20)

    class Meta:
        db_table = 'local'
        verbose_name = 'Local de Entrega'
        verbose_name_plural = 'Locais de Entrega'

    def __str__(self):
        return self.nome_local


# core/models.py (continuação)

class Familia(models.Model):
    TIPO_RECEBIMENTO_CHOICES = (
        ('estipulado',   'Estipulado'),
        ('nao_estipulado','Não Estipulado'),
    )
    STATUS_CHOICES = (
        ('ativo',       'Ativo'),
        ('inativo',     'Inativo'),
        ('bloqueado',   'Bloqueado'),
    )

    nome_familia          = models.CharField("Nome da Família",    max_length=100)
    nome_responsavel      = models.CharField("Responsável",        max_length=100)
    endereco              = models.CharField("Endereço",           max_length=150)
    cpf_responsavel       = models.CharField("CPF Responsável",    max_length=14, unique=True)
    tipo_recebimento      = models.CharField("Tipo Recebimento",   max_length=20, choices=TIPO_RECEBIMENTO_CHOICES, default='estipulado')
    renda_familia         = models.DecimalField("Renda da Família", max_digits=12, decimal_places=2)
    quantidade_integrantes= models.PositiveIntegerField("Qtd. Membros")
    tipo_moradia          = models.CharField("Moradia",            max_length=50)
    telefone              = models.CharField("Telefone",           max_length=30)
    data_atualizacao      = models.DateField("Atualização", auto_now=True)
    status                = models.CharField("Status",             max_length=10, choices=STATUS_CHOICES, default='ativo')

    class Meta:
        db_table = 'familia'
        verbose_name = 'Família'
        verbose_name_plural = 'Famílias'

    def __str__(self):
        return f"{self.nome_familia} ({self.cpf_responsavel})"
