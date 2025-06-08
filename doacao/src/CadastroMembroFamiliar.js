import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroUser.css';
import fundo from './Assets/Fundo.png';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica usuário logado
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
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Membro Familiar</h2>
          {form.familia_id && (
            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="familia_id"
                value={form.familia_id}
                className="cadastro-input"
                readOnly
                style={{ background: '#f0f0f0', color: '#888' }}
              />
              <span className="cadastro-focus-input" data-placeholder="ID da Família"></span>
            </div>
          )}
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className={`cadastro-input ${form.nome ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Nome do Membro"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              className={`cadastro-input ${form.cpf ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="CPF"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              className={`cadastro-input ${form.data_nascimento ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Data de Nascimento"></span>
          </div>
          <div className="cadastro-input-wrap" style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
            <input
              type="checkbox"
              name="pode_receber"
              checked={form.pode_receber}
              onChange={handleChange}
              style={{width: '20px', height: '20px', marginRight: '10px'}}
            />
            <label htmlFor="pode_receber" style={{fontSize: '16px', color: '#555'}}>Autorizado a retirar doações</label>
          </div>
          <div className="cadastro-btn-container">
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <button type="submit" className="cadastro-btn">
              Cadastrar Membro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroMembroFamiliar;
