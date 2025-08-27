import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style/CadastroFamilia.css';
import fundo from './Assets/Fundo.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from './Assets/plano3.png';
import Rodape from './Components/Rodape';

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
    // Busca todas as famílias cadastradas
    axios.get('http://127.0.0.1:8000/listar_familias/')
      .then(res => setFamilias(res.data))
      .catch(() => setFamilias([]));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Permite selecionar família, mas só redireciona ao clicar no botão
  const handleSelecionarFamilia = (e) => {
    const id = e.target.value;
    setFamiliaSelecionada(id);
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
        <h2>Alterar Família</h2>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
            {JSON.parse(localStorage.getItem('usuarioLogado'))?.nome || 'Usuário'}
          </span>
          <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /><line x1="9" y1="12" x2="21" y2="12" /></svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box" style={{ maxWidth: 600, width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Famílias Cadastradas</h2>
          {familias.length === 0 && <div style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma família cadastrada.</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {familias.map(f => (
              <div key={f.id_familia} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px 18px', background: '#f8fff8' }}>
                <span style={{ fontWeight: 600, fontSize: 17 }}>{f.nome_familia}</span>
                <button type="button" className="cadastro-btn" onClick={() => navigate(`/editar-familia/${f.id_familia}`)}>
                  Alterar Família
                </button>
              </div>
            ))}
          </div>
          <div className="cadastro-btn-container" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30 }}>
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)} style={{ background: '#e57373', minWidth: 120 }}>
              Voltar
            </button>
          </div>
          {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
          {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default AlterarFamilia;
