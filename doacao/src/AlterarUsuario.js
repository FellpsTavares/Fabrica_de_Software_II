import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style/CadastroUser.css';
import plano3 from './Assets/plano3.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import Rodape from './Components/Rodape';

function AlterarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Recupera o tipo de usuário do localStorage
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const tipoUsuario = (usuarioLogado?.tipo || '').trim().toUpperCase();
  const localUsuario = usuarioLogado?.local_nome || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let url = 'http://127.0.0.1:8000/listar_usuarios/';
    if (tipoUsuario === 'COORDENADOR') {
      url += '?local=' + encodeURIComponent(localUsuario);
    }
    axios.get(url)
      .then(res => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
  }, []);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, [name]: value } : u));
  };

  const handleSalvar = async (idx) => {
    setErro('');
    setSucesso('');
    const usuario = usuarios[idx];
    // Permissões
    if (tipoUsuario === 'COORDENADOR' && usuario.tipo_usuario === 'MASTER') {
      setErro('Coordenador não pode promover para MASTER.');
      return;
    }
    if (tipoUsuario === 'COORDENADOR' && usuario.tipo_usuario === 'COORDENADOR' && usuario.id !== usuarioLogado.id) {
      setErro('Coordenador só pode alterar seu próprio usuário COORDENADOR.');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/alterar_usuario/', usuario);
      setSucesso('Usuário alterado com sucesso!');
    } catch (err) {
      setErro('Erro ao alterar usuário: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleExcluir = async (idx) => {
    setErro('');
    setSucesso('');
    const usuario = usuarios[idx];
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.post('http://127.0.0.1:8000/excluir_usuario/', { id: usuario.id });
        setUsuarios(prev => prev.filter((_, i) => i !== idx));
        setSucesso('Usuário excluído com sucesso!');
      } catch (err) {
        setErro('Erro ao excluir usuário: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Permissão de acesso
  if (tipoUsuario !== 'MASTER' && tipoUsuario !== 'COORDENADOR') {
    return null;
  }

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
        <h2>Alterar Usuário</h2>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
            {usuarioLogado?.nome || 'Usuário'}
          </span>
          <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /><line x1="9" y1="12" x2="21" y2="12" /></svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box" style={{ width: '100%', maxWidth: 900 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Alterar Usuários</h2>
          {usuarios.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>Nenhum usuário encontrado.</div>}
          {usuarios.map((u, idx) => (
            <form key={u.id} onSubmit={e => { e.preventDefault(); handleSalvar(idx); }} className="cadastro-user-modern-form grid-form" style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 24, padding: 16, background: '#fff' }}>
              <div className="cadastro-user-grid">
                <div className="cadastro-input-wrap">
                  <input
                    type="text"
                    name="nome_usuario"
                    value={u.nome_usuario || ''}
                    onChange={e => handleChange(idx, e)}
                    className="cadastro-input"
                    required
                    placeholder="Nome Completo"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={u.email || ''}
                    onChange={e => handleChange(idx, e)}
                    className="cadastro-input"
                    required
                    placeholder="Email"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <select
                    name="tipo_usuario"
                    value={u.tipo_usuario || ''}
                    onChange={e => handleChange(idx, e)}
                    className="cadastro-input"
                    required
                  >
                    <option value="OPERACAO">OPERACAO</option>
                    <option value="COORDENADOR">COORDENADOR</option>
                    {tipoUsuario === 'MASTER' && <option value="MASTER">MASTER</option>}
                  </select>
                </div>
                <div className="cadastro-btn-container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="submit" className="cadastro-btn">Salvar</button>
                  <button type="button" className="cadastro-btn voltar-btn" style={{ background: '#e57373' }} onClick={() => handleExcluir(idx)}>
                    Excluir
                  </button>
                </div>
              </div>
            </form>
          ))}
          {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
          {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default AlterarUsuario;
