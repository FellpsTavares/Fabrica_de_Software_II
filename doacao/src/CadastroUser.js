// src/components/CadastroUser.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';           // <-- importe o axios
import './Style/CadastroUser.css';
import './Style/CheckboxModern.css';
import fundo from "./Assets/Fundo.png";
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";
import Rodape from './Components/Rodape';

function CadastroUser() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo_usuario: '',
    nome_local: ''
  });
  const [locais, setLocais] = useState([]);

  // Recupera o tipo de usuário do localStorage
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const tipoUsuario = (usuarioLogado?.tipo || '').trim().toUpperCase();
  const localCoordenador = usuarioLogado?.local_nome || usuarioLogado?.local || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tipoUsuario === 'MASTER') {
      axios.get('http://127.0.0.1:8000/listar_locais/')
        .then(res => setLocais(res.data))
        .catch(() => setLocais([]));
    }
    if (tipoUsuario === 'COORDENADOR') {
      setForm(prev => ({ ...prev, nome_local: localCoordenador }));
    }
  }, []);

  // Protege a tela: só permite acesso para MASTER ou COORDENADOR
  if (tipoUsuario !== 'MASTER' && tipoUsuario !== 'COORDENADOR') {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handler para checkboxes de tipo de usuário (apenas um pode ser selecionado)
  const handleTipoUsuarioChange = (tipo) => {
    setForm(prev => ({ ...prev, tipo_usuario: tipo }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validação básica
    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      if (!form.tipo_usuario) {
        alert('Selecione o cargo do usuário!');
        return;
      }
      // prepara o payload conforme o seu view espera
      const payload = {
        nome_usuario: form.nome,
        username: form.nome, // ou outro campo para login
        senha: form.senha,
        email: form.email,
        tipo_usuario: form.tipo_usuario,
        nome_local: form.nome_local
      };

      // faz a requisição ao backend
      const res = await axios.post(
        'http://127.0.0.1:8000/cadastrar_usuario/',
        payload,
      );

      // em caso de sucesso…
      console.log('Resposta do servidor:', res.data);
      alert(res.data.message || 'Cadastro bem-sucedido!');
      navigate('/Home'); 

    } catch (err) {
      console.error('Erro ao cadastrar:', err.response?.data || err.message);
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 6}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            {JSON.parse(localStorage.getItem('usuarioLogado'))?.nome || 'Usuário'}
          </span>
          <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box" style={{ maxWidth: 500, width: '100%', background: 'rgba(198, 240, 221, 0.92)', borderRadius: 12, boxShadow: '0 4px 24px #0002', padding: 32, margin: 24 }}>
          <form onSubmit={handleSubmit} className="cadastro-user-modern-form grid-form">
            <h2 className="cadastro-user-modern-title">Cadastro de Usuário</h2>
            <div className="cadastro-user-grid">
              <div className="cadastro-input-wrap">
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={`cadastro-input ${form.nome ? 'has-val' : ''}`}
                  required
                />
                <span className="cadastro-focus-input" data-placeholder="Nome Completo"></span>
              </div>
              <div className="cadastro-input-wrap">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`cadastro-input ${form.email ? 'has-val' : ''}`}
                  required
                />
                <span className="cadastro-focus-input" data-placeholder="Email"></span>
              </div>
              <div className="cadastro-input-wrap">
                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  className={`cadastro-input ${form.senha ? 'has-val' : ''}`}
                  required
                />
                <span className="cadastro-focus-input" data-placeholder="Senha"></span>
              </div>
              <div className="cadastro-input-wrap">
                <input
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  className={`cadastro-input ${form.confirmarSenha ? 'has-val' : ''}`}
                  required
                />
                <span className="cadastro-focus-input" data-placeholder="Confirmar Senha"></span>
              </div>

              {/* Seleção de tipo de usuário (cargo) */}
              <div className="cadastro-input-wrap" style={{ gridColumn: '1 / -1', margin: '10px 0 10px 0', display: 'flex', justifyContent: 'center', gap: 24 }}>
                {tipoUsuario === 'MASTER' && (
                  <>
                    <label className="checkbox-modern">
                      <input type="checkbox" checked={form.tipo_usuario === 'MASTER'} onChange={() => handleTipoUsuarioChange('MASTER')} />
                      <span className="checkmark"></span>
                      MASTER
                    </label>
                  </>
                )}
                <label className="checkbox-modern">
                  <input type="checkbox" checked={form.tipo_usuario === 'COORDENADOR'} onChange={() => handleTipoUsuarioChange('COORDENADOR')} disabled={tipoUsuario !== 'MASTER' && tipoUsuario !== 'COORDENADOR'} />
                  <span className="checkmark"></span>
                  COORDENADOR
                </label>
                <label className="checkbox-modern">
                  <input type="checkbox" checked={form.tipo_usuario === 'OPERACAO'} onChange={() => handleTipoUsuarioChange('OPERACAO')} />
                  <span className="checkmark"></span>
                  OPERACAO
                </label>
              </div>
              <div className="cadastro-input-wrap" style={{gridColumn: '1 / -1'}}>
                {tipoUsuario === 'MASTER' ? (
                  <select
                    name="nome_local"
                    value={form.nome_local}
                    onChange={handleChange}
                    className={`cadastro-input ${form.nome_local ? 'has-val' : ''}`}
                    required
                  >
                    <option value=""></option>
                    {locais.map(local => (
                      <option key={local.id_local_entrega || local.id} value={local.nome_local}>
                        {local.nome_local}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="nome_local"
                    value={form.nome_local}
                    disabled
                    className={`cadastro-input ${form.nome_local ? 'has-val' : ''}`}
                    required
                  />
                )}
                <span className="cadastro-focus-input" data-placeholder="Local de Trabalho"></span>
              </div>
            </div>
            <div className="cadastro-btn-container">
              <button 
                type="button" 
                className="cadastro-btn voltar-btn"
                onClick={() => navigate(-1)}>
                Voltar
              </button>
              <button type="submit" className="cadastro-btn">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default CadastroUser;
