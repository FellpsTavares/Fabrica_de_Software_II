import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style/CadastroFamilia.css';
import fundo from './Assets/Fundo.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from './Assets/plano3.png';

function AlterarFamilia() {
  const [familias, setFamilias] = useState([]);
  const [familiaSelecionada, setFamiliaSelecionada] = useState(null);
  const [membros, setMembros] = useState([]);
  const [novoMembro, setNovoMembro] = useState({ nome: '', cpf: '', data_nascimento: '', pode_receber: false });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca todas as famílias sem filtro de busca
    axios.get('http://127.0.0.1:8000/buscar_familias/?q=aaa')
      .then(res => setFamilias(res.data))
      .catch(() => setFamilias([]));
  }, []);

  // Corrige: não buscar membros nem mostrar membros na tela de seleção, só redireciona
  const handleSelecionarFamilia = (e) => {
    const id = e.target.value;
    setFamiliaSelecionada(id);
    if (id) {
      navigate(`/editar-familia/${id}`);
    }
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Alterar Família</h2>
          <div className="cadastro-input-wrap">
            <select value={familiaSelecionada || ''} onChange={handleSelecionarFamilia} className="cadastro-input">
              <option value="">Selecione uma família</option>
              {familias.map(f => (
                <option key={f.id_familia} value={f.id_familia}>{f.nome_familia}</option>
              ))}
            </select>
          </div>
          <div className="cadastro-btn-container" style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)} style={{ transition: 'background 0.2s', background: '#e57373' }}
              onMouseOver={e => e.currentTarget.style.background = '#c62828'}
              onMouseOut={e => e.currentTarget.style.background = '#e57373'}>
              Voltar
            </button>
          </div>
          {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
          {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
        </div>
      </div>
    </>
  );
}

export default AlterarFamilia;
