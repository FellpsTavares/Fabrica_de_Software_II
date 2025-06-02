import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Style//Home.css'; // Importando o arquivo CSS separado

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const goToCadastro = () => {
    navigate('/Cadastro');
  };

  const goToFamilia = () => {
    navigate('/CadastroFamilia');
  };

  const goToLocal = () => {
    navigate('/CadastroLocal');
  };

  const goToDoacoes = () => {
    navigate('/CadastroDoacoes');
  };

  const goToSaidaDoacao = () => {
    navigate('/saidaDoacao');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h2>Gerenciamento de Doações</h2>
        <div>
          <button onClick={handleLogout} className="header-button">Sair</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1>Bem-vindo ao <strong>Gerenciamento de Doações</strong></h1>
        <p className="subtitle">Facilitando o controle de entradas e saídas de doações</p>

        <div className="options-grid">
          <div className="option-card" onClick={goToCadastro}>
            <h3>Cadastrar Usuários</h3>
            <p>Cadastrar novos usuários</p>
          </div>

          <div className="option-card" onClick={goToFamilia}>
            <h3>Cadastrar Família</h3>
            <p>Registrar informações das famílias</p>
          </div>

          <div className="option-card" onClick={goToLocal}>
            <h3>Cadastrar Local</h3>
            <p>Registrar Novos Locais de retirada</p>
          </div>

          <div className="option-card" onClick={goToDoacoes}>
            <h3>Entradas de Doações</h3>
            <p>Visualizar às entradas de doações</p>
          </div>

          <div className="option-card" onClick={goToSaidaDoacao}>
            <h3>Saídas de Doações</h3>
            <p>Registrar retirada de doações</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;