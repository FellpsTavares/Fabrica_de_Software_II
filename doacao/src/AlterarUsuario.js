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
      .then(res => {
        // Separa ativos e inativos pelo campo is_active
        const all = Array.isArray(res.data) ? res.data : [];
        setUsuarios(all);
      })
      .catch(() => setUsuarios([]));
  }, []);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, [name]: value } : u));
  };

  // Campo de senha temporário (não deve ser exibido valor atual)
  const handleSenhaChange = (idx, value) => {
    setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, senha: value } : u));
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
    try {
      // Ajuste para enviar apenas campos editáveis
      const payload = {
        id: usuario.id,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      };
      if (usuario.senha && usuario.senha.length > 0) {
        payload.senha = usuario.senha;
      }
      await axios.post('http://127.0.0.1:8000/atualizar_usuario/', payload);
  setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, senha: '' } : u)); // Limpa campo senha após salvar
  setSucesso('Usuário alterado com sucesso!');
    } catch (err) {
      setErro('Erro ao alterar usuário: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDesativar = async (idx) => {
    setErro('');
    setSucesso('');
    const usuario = usuarios[idx];
    if (window.confirm('Tem certeza que deseja desativar este usuário?')) {
      try {
        await axios.post('http://127.0.0.1:8000/desativar_usuario/', { id: usuario.id });
        setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, is_active: false } : u));
        setSucesso('Usuário desativado com sucesso!');
      } catch (err) {
        setErro('Erro ao desativar usuário: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleAtivar = async (idx) => {
    setErro('');
    setSucesso('');
    const usuario = usuarios[idx];
    if (window.confirm('Tem certeza que deseja ativar este usuário?')) {
      try {
        await axios.post('http://127.0.0.1:8000/ativar_usuario/', { id: usuario.id });
        setUsuarios(prev => prev.map((u, i) => i === idx ? { ...u, is_active: true } : u));
        setSucesso('Usuário ativado com sucesso!');
      } catch (err) {
        setErro('Erro ao ativar usuário: ' + (err.response?.data?.error || err.message));
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
      {/* Botão Voltar fixo abaixo do cabeçalho, lateral direita */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          top: 90,
          right: 32,
          zIndex: 1000,
          background: '#155724',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 22px',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 2px 8px #0002',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#155724')}
        onMouseOut={e => (e.currentTarget.style.background = '#155724')}
      >
        Voltar
      </button>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box" style={{ width: '100%', maxWidth: 900 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Alterar Usuários</h2>
          {usuarios.filter(u => u.is_active !== false).length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>Nenhum usuário ativo encontrado.</div>}
          {/* Mensagem de confirmação ao salvar */}
          {sucesso && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: 6,
              padding: '10px 16px',
              marginBottom: 18,
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 2px 8px #0001'
            }}>
              {sucesso}
            </div>
          )}
          {usuarios.filter(u => u.is_active !== false).map((u, idx) => (
            <form key={u.id} onSubmit={e => { e.preventDefault(); handleSalvar(usuarios.findIndex(us => us.id === u.id)); }} className="cadastro-user-modern-form grid-form" style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 24, padding: 16, background: '#fff' }}>
              <div className="cadastro-user-grid">
                <div className="cadastro-input-wrap">
                  <label style={{ fontWeight: 600, marginBottom: 2, display: 'block' }}>Nome de Usuário</label>
                  <input
                    type="text"
                    name="nome_usuario"
                    value={u.nome_usuario || ''}
                    onChange={e => handleChange(usuarios.findIndex(us => us.id === u.id), e)}
                    className="cadastro-input"
                    required
                    placeholder="Nome Completo"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <label style={{ fontWeight: 600, marginBottom: 2, display: 'block' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={u.email || ''}
                    onChange={e => handleChange(usuarios.findIndex(us => us.id === u.id), e)}
                    className="cadastro-input"
                    required
                    placeholder="Email"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <label style={{ fontWeight: 600, marginBottom: 2, display: 'block' }}>Papel (Cargo)</label>
                  <select
                    name="tipo_usuario"
                    value={u.tipo_usuario || ''}
                    onChange={e => handleChange(usuarios.findIndex(us => us.id === u.id), e)}
                    className="cadastro-input" style={{ border: '2px solid #1976d2', background: '#f5faff', fontWeight: 500 }}
                    required
                  >
                    <option value="" disabled>Selecione o cargo...</option>
                    <option value="OPERACAO">OPERACAO</option>
                    <option value="COORDENADOR">COORDENADOR</option>
                    {tipoUsuario === 'MASTER' && <option value="MASTER">MASTER</option>}
                  </select>
                </div>
                <div className="cadastro-input-wrap">
                  <label style={{ fontWeight: 600, marginBottom: 2, display: 'block' }}>Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={typeof u.senha === 'string' && u.senha.length > 0 ? u.senha : '******'}
                    onFocus={e => {
                      if (e.target.value === '******') handleSenhaChange(usuarios.findIndex(us => us.id === u.id), '');
                    }}
                    onChange={e => handleSenhaChange(usuarios.findIndex(us => us.id === u.id), e.target.value)}
                    className="cadastro-input"
                    placeholder="Nova senha (opcional)"
                    autoComplete="new-password"
                  />
                </div>
                <div className="cadastro-btn-container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="submit" className="cadastro-btn">Salvar</button>
                  <button type="button" className="cadastro-btn voltar-btn" style={{ background: '#e57373' }} onClick={() => handleDesativar(usuarios.findIndex(us => us.id === u.id))}>
                    Desativar
                  </button>
                </div>
              </div>
            </form>
          ))}
          {/* Separador */}
          <hr style={{ margin: '32px 0', border: 0, borderTop: '2px dashed #bbb' }} />
          <h3 style={{ textAlign: 'center', color: '#888', marginBottom: 16 }}>Usuários Desativados</h3>
          {usuarios.filter(u => u.is_active === false).length === 0 && <div style={{ textAlign: 'center', color: '#bbb' }}>Nenhum usuário desativado.</div>}
          {usuarios.filter(u => u.is_active === false).map((u, idx) => (
            <form key={u.id} className="cadastro-user-modern-form grid-form" style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 18, padding: 12, background: '#f8f8f8', opacity: 0.7 }}>
              <div className="cadastro-user-grid">
                <div className="cadastro-input-wrap">
                  <input
                    type="text"
                    name="nome_usuario"
                    value={u.nome_usuario || ''}
                    disabled
                    className="cadastro-input"
                    placeholder="Nome Completo"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={u.email || ''}
                    disabled
                    className="cadastro-input"
                    placeholder="Email"
                  />
                </div>
                <div className="cadastro-input-wrap">
                  <select
                    name="tipo_usuario"
                    value={u.tipo_usuario || ''}
                    disabled
                    className="cadastro-input"
                  >
                    <option value="OPERACAO">OPERACAO</option>
                    <option value="COORDENADOR">COORDENADOR</option>
                    {tipoUsuario === 'MASTER' && <option value="MASTER">MASTER</option>}
                  </select>
                </div>
                <div className="cadastro-btn-container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="button" className="cadastro-btn voltar-btn" style={{ background: '#7fc98f', color: '#fff' }} onClick={() => handleAtivar(usuarios.findIndex(us => us.id === u.id))}>
                    Ativar
                  </button>
                </div>
              </div>
            </form>
          ))}
          {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
          {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
        </div>
      </div>
  {/* Botão de voltar removido da parte inferior */}
      <Rodape />
    </>
  );
}

export default AlterarUsuario;
