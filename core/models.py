from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('MASTER', 'Master'),
        ('COORDENADOR', 'Coordenador'),
        ('OPERACAO', 'Operacional'),
    )
    id = models.AutoField(primary_key=True)
    nome_usuario = models.CharField("Nome", max_length=80)
    username = models.CharField("Login", max_length=20, unique=True)
    email = models.EmailField("E-mail", max_length=50, unique=True)
    tipo_usuario = models.CharField(
        "Tipo", max_length=20, choices=TIPO_CHOICES, default='OPERACAO'
    )
    local = models.ForeignKey('LocalEntrega', on_delete=models.PROTECT, db_column='id_local_entrega', to_field='id', null=False)

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

class Estoque(models.Model):
    id_estoque = models.AutoField(primary_key=True, db_column='id_estoque')
    nome = models.CharField(max_length=50)

    class Meta:
        db_table = 'estoque'
        verbose_name = 'Estoque'
        verbose_name_plural = 'Estoques'

    def __str__(self):
        return self.nome

class LocalEntrega(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_local_entrega')
    nome_local = models.CharField("Nome do Local", max_length=50)
    funcionarios = models.CharField("Funcionários", max_length=150)
    endereco = models.CharField("Endereço", max_length=150)
    coordenador = models.CharField("Coordenador", max_length=80)
    telefone = models.CharField("Telefone", max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'local'
        verbose_name = 'Local de Entrega'
        verbose_name_plural = 'Locais de Entrega'

    def __str__(self):
        return self.nome_local

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            Estoque.objects.create(nome=self.nome_local)

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
    data_modificacao = models.DateTimeField(auto_now=True)
    motivo_exclusao = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'membro_familiar'
        verbose_name = 'Membro Familiar'
        verbose_name_plural = 'Membros Familiares'
        unique_together = ('cpf', 'familia')

    def __str__(self):
        return self.nome

class UnidadeMedida(models.Model):
    id_unidade = models.AutoField(primary_key=True, db_column='id_unidade')
    nome = models.CharField(max_length=30, unique=True)

    class Meta:
        db_table = 'unidade_medida'
        verbose_name = 'Unidade de Medida'
        verbose_name_plural = 'Unidades de Medida'

    def __str__(self):
        return self.nome

class Produto(models.Model):
    id_produto = models.AutoField(primary_key=True, db_column='id_produto')
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    unidade_medida = models.ForeignKey('UnidadeMedida', on_delete=models.PROTECT, db_column='unidade_id', to_field='id_unidade')
    quantidade = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estoque = models.ForeignKey('Estoque', on_delete=models.PROTECT, db_column='estoque_id', to_field='id_estoque', null=True, blank=True)  # NOVO CAMPO

    class Meta:
        db_table = 'produto'
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return self.nome

class DistribuicaoProduto(models.Model):
    id_distribuicao = models.AutoField(primary_key=True, db_column='id_distribuicao')
    membro = models.ForeignKey('MembroFamiliar', on_delete=models.CASCADE, db_column='membro_id', to_field='id_membro')
    estoque = models.ForeignKey('Estoque', on_delete=models.CASCADE, db_column='estoque_id', to_field='id_estoque')
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, db_column='usuario_id', to_field='id')
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE, db_column='produto_id', to_field='id_produto')
    quantidade = models.DecimalField(max_digits=10, decimal_places=2)
    data_distribuicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'distribuicao_produto'
        verbose_name = 'Distribuição de Produto'
        verbose_name_plural = 'Distribuições de Produto'

class MovimentacaoEstoque(models.Model):
    id_movimentacao = models.AutoField(primary_key=True, db_column='id_movimentacao')
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE, db_column='produto_id', to_field='id_produto')
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, db_column='usuario_id', to_field='id')
    estoque_origem = models.ForeignKey('Estoque', on_delete=models.SET_NULL, null=True, blank=True, db_column='estoque_origem_id', to_field='id_estoque', related_name='movimentacoes_saida')
    estoque_destino = models.ForeignKey('Estoque', on_delete=models.SET_NULL, null=True, blank=True, db_column='estoque_destino_id', to_field='id_estoque', related_name='movimentacoes_entrada')
    tipo_movimentacao = models.CharField(max_length=10)
    quantidade = models.DecimalField(max_digits=10, decimal_places=2)
    data_movimentacao = models.DateTimeField(auto_now_add=True)
    membro = models.ForeignKey('MembroFamiliar', on_delete=models.SET_NULL, null=True, blank=True, db_column='membro_id', to_field='id_membro')

    class Meta:
        db_table = 'movimentacao_estoque'
        verbose_name = 'Movimentação de Estoque'
        verbose_name_plural = 'Movimentações de Estoque'

class AutorizacaoRetirada(models.Model):
    id_autorizacao = models.AutoField(primary_key=True, db_column='id_autorizacao')
    membro = models.ForeignKey('MembroFamiliar', on_delete=models.CASCADE, db_column='membro_id', to_field='id_membro', null=True, blank=True)
    familia = models.ForeignKey('Familia', on_delete=models.CASCADE, db_column='familia_id', to_field='id')
    familia_origem = models.ForeignKey('Familia', on_delete=models.SET_NULL, null=True, blank=True, db_column='familia_origem_id', related_name='autorizacoes_origem')
    data_inicio = models.DateField()
    data_fim = models.DateField(null=True, blank=True)
    motivo = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'autorizacao_retirada'
        verbose_name = 'Autorização de Retirada'
        verbose_name_plural = 'Autorizações de Retirada'

    def __str__(self):
        membro_nome = self.membro.nome if self.membro else '(externo)'
        return f"{membro_nome} autorizado para família {self.familia.nome_familia}"

