from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('MASTER', 'Master'),
        ('LOCAL', 'Local de Entrega'),
    )
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='LOCAL')
    class Meta:
        db_table = 'usuario'

class LocalEntrega(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)

    def __str__(self):
        return self.nome
    class Meta:
        db_table = 'local_entrega'

class Familia(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    endereco = models.CharField(max_length=200)
    pessoas_autorizadas = models.TextField()  # Pode colocar uma lista separada por vírgula inicialmente

    def __str__(self):
        return self.nome
    class Meta:
        db_table = 'familia'