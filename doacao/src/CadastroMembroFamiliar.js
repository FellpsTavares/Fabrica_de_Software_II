import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroMembroFamiliar.css';
import plano3 from './Assets/plano3.png';
import homeLogo from './Assets/home.jpg';
import MenuLateral from './Components/MenuLateral';
import Rodape from './Components/Rodape';

function CadastroMembroFamiliar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const familiaIdParam = params.get('familia_id');
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    pode_receber: false,
    familia_id: familiaIdParam || ''
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const usuario_id = usuarioLogado?.id;
    if (!usuario_id) {
      alert('Usuário não autenticado! Faça login novamente.');
      return;
    }
    try {
      const payload = { ...form, usuario_id };
      const res = await axios.post('http://127.0.0.1:8000/cadastrar_membro_familiar/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert(res.data.message || 'Membro cadastrado com sucesso!');
      setForm({ nome: '', cpf: '', data_nascimento: '', pode_receber: false });
      navigate('/home');
    } catch (err) {
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cadastro-membro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5` }}>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
        </div>
        <h2>Assistência Social Digital</h2>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 6}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            {usuarioLogado?.nome || 'Usuário'}
          </span>
          <button className="voltar-btn-header" onClick={() => navigate(-1)} title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>
      </header>
      <div className="cadastro-membro-box">
        <form onSubmit={handleSubmit} className="cadastro-membro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Membro Familiar</h2>
          {form.familia_id && (
            <div className="cadastro-membro-input-wrap">
              <input
                type="text"
                name="familia_id"
                value={form.familia_id}
                readOnly
                className="cadastro-membro-input"
              />
              <span className="cadastro-membro-focus-input" data-placeholder="ID da Família" />
            </div>
          )}
          <div className="cadastro-membro-input-wrap">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="cadastro-membro-input"
              required
            />
            <span className="cadastro-membro-focus-input" data-placeholder="Nome do Membro" />
          </div>
          <div className="cadastro-membro-input-wrap">
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              className="cadastro-membro-input"
              required
            />
            <span className="cadastro-membro-focus-input" data-placeholder="CPF" />
          </div>
          <div className="cadastro-membro-input-wrap">
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              className="cadastro-membro-input"
              required
            />
            <span className="cadastro-membro-focus-input" data-placeholder="Data de Nascimento" />
          </div>
          <div className="cadastro-membro-input-wrap" style={{ border: 'none', marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                name="pode_receber"
                checked={form.pode_receber}
                onChange={handleChange}
                style={{ width: 18, height: 18 }}
              />
              Pode receber doação
            </label>
          </div>
          <div className="cadastro-membro-btn-container">
            <button type="button" className="voltar-btn" style={{ order: 1, minWidth: 120 }} onClick={() => navigate(-1)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 6}}><polyline points="15 18 9 12 15 6"/></svg>
              Voltar
            </button>
            <button type="submit" className="cadastro-membro-btn" style={{ order: 2, minWidth: 120 }}>
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      <Rodape />
    </div>
  );
}

export default CadastroMembroFamiliar;
