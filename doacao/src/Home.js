import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redireciona para a página de login
  };

  const goToCadastro = () => {
    navigate('/Cadastro');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Página Inicial</h1>

      <div style={{ marginTop: '20px' }}>
        <button
          className="cadastro-btn"
          onClick={goToCadastro}
          style={{ marginRight: '10px' }}
        >
          Cadastrar Usuários
        </button>

        <div style={{padding: '100PX'}}> TESTEEEE</div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default Home;
