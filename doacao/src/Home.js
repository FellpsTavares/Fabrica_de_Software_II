import React from 'react';
import { useNavigate } from 'react-router-dom';
//import { Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Volta para a página inicial (Login)
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Página Inicial</h1>

      <button className="cadastro-btn" onClick={() => navigate('/Cadastro')}
      >
        Cadastrar usuarios
      </button>


      <button onClick={handleLogout} className="logout-btn">
        Sair
      </button>

    </div>
  );
}

export default Home;