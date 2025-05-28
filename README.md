# Projeto de Gerenciamento de Doações

Este projeto é um sistema web para gerenciar doações, cadastrando famílias necessitadas, usuários e operadores da distribuição de cestas básicas, além de gerar diversos tipos de relatórios.

## Tecnologias Utilizadas

* **Backend:** Python com Django
* **Frontend:** React
* **Banco de Dados:** (Não especificado nos arquivos, mas Django geralmente usa PostgreSQL, MySQL, SQLite ou Oracle)
* **Outras bibliotecas/ferramentas:**
    * Axios (para requisições HTTP no frontend)
    * React Router DOM (para gerenciamento de rotas no frontend)

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

* `projeto_doacao/` : Contém a configuração principal do projeto Django e o aplicativo `core`.
    * `core/`: Aplicativo Django principal contendo:
        * `models.py`: Define os modelos de dados (Usuario, LocalEntrega, Familia, PessoaAutorizada).
        * `views.py`: Contém a lógica para processar requisições HTTP e interagir com os modelos (ex: `cadastrar_usuario`, `cadastrar_local`, `cadastrar_familia`, `cadastrar_pessoa_autorizada`).
        * `urls.py`: Define as rotas da API do backend.
        * `migrations/`: Contém os arquivos de migração do banco de dados.
        * `templates/`: Contém templates HTML (embora o foco principal do frontend seja React).
    * `doacao/`: Contém o código do frontend em React.
        * `public/`: Arquivos públicos do frontend, como `index.html`.
        * `src/`: Código fonte do React.
            * `Assets/`: Imagens e outros assets.
            * `Infos/`: Arquivos com dados estáticos (ex: `LocaisBrasil.js`).
            * `Style/`: Arquivos CSS para estilização dos componentes.
            * `CadastroFamilia.js`: Componente React para cadastro de famílias.
            * `CadastroLocal.js`: Componente React para cadastro de locais de entrega.
            * `CadastroResponsavel.js`: Componente React para cadastro de responsáveis.
            * `CadastroUser.js`: Componente React para cadastro de usuários.
            * `Home.js`: Componente React da página inicial após login.
            * `Login.js`: Componente React para a tela de login.
            * `Routes.js`: Define as rotas do frontend.
            * `index.js`: Ponto de entrada da aplicação React.
        * `package.json`: Define as dependências e scripts do projeto React.
    * `manage.py`: Utilitário de linha de comando do Django.
* `node_modules/`: Contém as dependências do Node.js para o frontend React (geralmente não incluído no repositório Git, mas listado no `package-lock.json`).

## Funcionalidades Principais

### Backend (Django)

* **Cadastro de Usuários:** Permite registrar novos usuários no sistema com diferentes tipos (Master, Coordenador, Operacional).
* **Cadastro de Locais de Entrega:** Permite registrar informações sobre os locais onde as doações são distribuídas.
* **Cadastro de Famílias:** Permite registrar informações detalhadas sobre as famílias que necessitam de doações, incluindo renda, número de integrantes, tipo de moradia e status.
* **Cadastro de Pessoas Autorizadas:** Permite registrar pessoas autorizadas a retirar doações em nome de uma família.

### Frontend (React)

* **Tela de Login:** Permite que usuários acessem o sistema.
* **Página Inicial (Home):** Apresenta as opções disponíveis após o login, como cadastros diversos.
* **Formulários de Cadastro:**
    * Cadastro de Usuários
    * Cadastro de Famílias
    * Cadastro de Locais de Entrega
    * Cadastro de Responsáveis
* **Gerenciamento de Rotas:** Navegação entre as diferentes telas da aplicação.

## Configuração e Instalação

### Backend (Django)

1.  **Pré-requisitos:**
    * Python
    * Pip (gerenciador de pacotes Python)
    * Virtualenv (recomendado)
2.  **Instalação:**
    * Clone o repositório.
    * Crie e ative um ambiente virtual:
        ```bash
        python -m venv venv
        source venv/bin/activate  # Linux/macOS
        # venv\Scripts\activate  # Windows
        ```
    * Instale as dependências do Python (geralmente de um arquivo `requirements.txt`, não fornecido nos arquivos, mas que conteria `Django` e outras bibliotecas necessárias).
        ```bash
        pip install Django  # Exemplo, idealmente usar requirements.txt
        ```
    * Aplique as migrações do banco de dados:
        ```bash
        python projeto_doacao/manage.py migrate
        ```
    * Crie um superusuário (se necessário para acesso ao Admin do Django):
        ```bash
        python projeto_doacao/manage.py createsuperuser
        ```
    * Inicie o servidor de desenvolvimento do Django:
        ```bash
        python projeto_doacao/manage.py runserver
        ```
    Por padrão, o backend estará acessível em `http://127.0.0.1:8000/`.

### Frontend (React)

1.  **Pré-requisitos:**
    * Node.js
    * Yarn ou npm (gerenciador de pacotes Node.js)
2.  **Instalação:**
    * Navegue até o diretório `projeto_doacao/doacao/`:
        ```bash
        cd projeto_doacao/doacao
        ```
    * Instale as dependências do Node.js:
        ```bash
        yarn install
        # ou
        # npm install
        ```
    * Inicie o servidor de desenvolvimento do React:
        ```bash
        yarn start
        # ou
        # npm start
        ```
    Por padrão, o frontend estará acessível em `http://localhost:3000/`.

## Endpoints da API (Exemplos)

* `POST /cadastrar_usuario/`: Para registrar um novo usuário.
* `POST /cadastrar_local/`: Para registrar um novo local de entrega.
* `POST /cadastrar_familia/`: Para registrar uma nova família.
* `POST /cadastrar_pessoa_autorizada/`: Para registrar uma nova pessoa autorizada.

## Próximos Passos (Sugestões)

* Implementar as funcionalidades de gerenciamento de doações (entrada e saída).
* Desenvolver os diversos tipos de relatórios.
* Melhorar a autenticação e autorização.
* Adicionar testes unitários e de integração.
* Implementar a comunicação completa entre frontend e backend para todas as funcionalidades.
* Estilizar todas as páginas de forma consistente.
* Criar um arquivo `requirements.txt` para o backend.

## Como Contribuir

(Esta seção pode ser preenchida com diretrizes para contribuição, caso o projeto seja aberto.)
