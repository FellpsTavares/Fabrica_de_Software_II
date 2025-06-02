// src/components/CadastroUser.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';           // <-- importe o axios
import './Style/CadastroUser.css';
import fundo from "./Assets/Fundo.png";

function CadastroUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nome_local: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validação básica
    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      // prepara o payload conforme o seu view espera
      const payload = {
        nome_usuario: form.nome,
        username: form.nome, // ou outro campo para login
        senha: form.senha,
        email: form.email,
        nome_local: form.nome_local
      };

      // faz a requisição ao backend
      const res = await axios.post(
        'http://127.0.0.1:8000/cadastrar_usuario/',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // em caso de sucesso…
      console.log('Resposta do servidor:', res.data);
      alert(res.data.message || 'Cadastro bem-sucedido!');
      navigate('/login');  // ou para onde quiser redirecionar

    } catch (err) {
      console.error('Erro ao cadastrar:', err.response?.data || err.message);
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          {/* Nome */}
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className={`cadastro-input ${form.nome ? 'has-val' : ''}`}
            />
            <span className="cadastro-focus-input" data-placeholder="Nome Completo"></span>
          </div>

          {/* Email */}
          <div className="cadastro-input-wrap">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`cadastro-input ${form.email ? 'has-val' : ''}`}
            />
            <span className="cadastro-focus-input" data-placeholder="Email"></span>
          </div>

          {/* Senha */}
          <div className="cadastro-input-wrap">
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              className={`cadastro-input ${form.senha ? 'has-val' : ''}`}
            />
            <span className="cadastro-focus-input" data-placeholder="Senha"></span>
          </div>

          {/* Confirmar Senha */}
          <div className="cadastro-input-wrap">
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              className={`cadastro-input ${form.confirmarSenha ? 'has-val' : ''}`}
            />
            <span className="cadastro-focus-input" data-placeholder="Confirmar Senha"></span>
          </div>

          {/* Nome do Local de Trabalho */}
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome_local"
              value={form.nome_local}
              onChange={handleChange}
              className={`cadastro-input ${form.nome_local ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Local de Trabalho (nome do local)"></span>
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
  );
}

export default CadastroUser;
