from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Usuario(AbstractUser):
    # Modifique os campos groups e user_permissions
    groups = models.ManyToManyField(
        Group,
        related_name="usuario_set",  # Nome para o relacionamento reverso
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="usuario_permissions_set",  # Nome para o relacionamento reverso
        blank=True
    )

class LocalEntrega(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)

    def __str__(self):
        return self.nome

class Familia(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    endereco = models.CharField(max_length=200)
    pessoas_autorizadas = models.TextField()  # Pode colocar uma lista separada por vírgula inicialmente

    def __str__(self):
        return self.nome
