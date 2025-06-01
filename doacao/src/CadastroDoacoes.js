import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroUser.css';
import fundo from './Assets/Fundo.png';

function CadastroDoacoes() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    unidade_medida: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/cadastrar_produto/', form, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert(res.data.message || 'Produto cadastrado com sucesso!');
      setForm({ nome: '', descricao: '', unidade_medida: '' });
      navigate('/home');
    } catch (err) {
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Doação</h2>
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className={`cadastro-input ${form.nome ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Nome do Produto"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className={`cadastro-input ${form.descricao ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Descrição"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="unidade_medida"
              value={form.unidade_medida}
              onChange={handleChange}
              className={`cadastro-input ${form.unidade_medida ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Unidade de Medida (kg, litro, unidade, etc.)"></span>
          </div>
          <div className="cadastro-btn-container">
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <button type="submit" className="cadastro-btn">
              Cadastrar Doação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroDoacoes;
