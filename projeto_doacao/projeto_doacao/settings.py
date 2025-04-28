from pathlib import Path

# Caminho base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

# Segurança
SECRET_KEY = 'sua-chave-secreta-aqui'  # Troque por uma chave secreta forte!

# Desenvolvimento (trocar para False em produção)
DEBUG = True

# Em desenvolvimento pode deixar vazio ou localhost
ALLOWED_HOSTS = []

# Aplicativos instalados no projeto
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',  # Exemplo: se você criar um app chamado 'core'
  
]
# settings.py
AUTH_USER_MODEL = 'core.Usuario'

# Middlewares (intermediadores entre requisições e respostas)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL raiz
ROOT_URLCONF = 'projeto_doacao.urls'

# Templates (onde ficam os arquivos HTML, CSS integrados)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Diretório onde você vai colocar seus templates
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI
WSGI_APPLICATION = 'projeto_doacao.wsgi.application'

# Banco de dados (usando mysql para começar)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'doacao',
        'USER': 'root',  
        'PASSWORD': '12345', 
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Validações de senha
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Configurações de idioma e horário
LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True

# Arquivos estáticos (CSS, JavaScript, Imagens)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Configurações para arquivos de mídia (uploads de imagens, etc.)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Padrão para novo campo ID do Django 4+
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
