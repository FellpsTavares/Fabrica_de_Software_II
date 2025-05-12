import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  const goToDoacoes = () => {
    navigate('/CadastroDoacoes');
  };

  const goToEstoque = () => {
    navigate('/Estoque');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      {/* Navbar */}
      <header style={{
        backgroundColor: '#0066cc',
        color: '#fff',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Sistema de Doações</h2>
        <div>
          <button onClick={goToCadastro} style={buttonStyle}>Cadastrar Usuários</button>
          <button onClick={handleLogout} style={buttonStyle}>Sair</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '50px 20px',
        textAlign: 'center',
        backgroundColor: '#e0eaff'
      }}>
        <h1>Bem-vindo ao Sistema de Gerenciamento de Doações</h1>
        <p style={{ fontSize: '18px' }}>
          Gerencie doações, famílias beneficiadas e o estoque de forma eficiente.
        </p>
      </section>

      {/* Cards de Navegação */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '40px 20px'
      }}>
        <Card title="Cadastrar Família" onClick={goToFamilia} />
        <Card title="Cadastrar Doações" onClick={goToDoacoes} />
        <Card title="Visualizar Estoque" onClick={goToEstoque} />
      </section>

      {/* Rodapé */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#ccc'
      }}>
        &copy; 2025 Sistema de Doações. Todos os direitos reservados.
      </footer>
    </div>
  );
}

// Componente de Card reutilizável
function Card({ title, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: '250px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '30px 20px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <h3>{title}</h3>
    </div>
  );
}

const buttonStyle = {
  marginLeft: '10px',
  backgroundColor: '#004d99',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Home;
