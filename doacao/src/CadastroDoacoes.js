import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroUser.css';
import fundo from './Assets/Fundo.png';
import UnidadesMedida from './UnidadesMedida';

function CadastroDoacoes() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    unidade_id: '',
    quantidade: ''
  });
  const [unidades, setUnidades] = useState([]);
  const [showUnidadeModal, setShowUnidadeModal] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/listar_unidades_medida/')
      .then(res => setUnidades(res.data))
      .catch(() => setUnidades([]));
  }, [showUnidadeModal]); // Atualiza ao fechar modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Monta o JSON correto
    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      unidade_id: Number(form.unidade_id),
      quantidade: Number(form.quantidade)
    };
    try {
      const res = await axios.post('http://127.0.0.1:8000/cadastrar_produto/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert(res.data.message || 'Produto cadastrado com sucesso!');
      setForm({ nome: '', descricao: '', unidade_id: '', quantidade: '' });
      navigate('/home');
    } catch (err) {
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Produto</h2>
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
          <div className="cadastro-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              name="unidade_id"
              value={form.unidade_id}
              onChange={handleChange}
              className={`cadastro-input ${form.unidade_id ? 'has-val' : ''}`}
              required
              style={{ flex: 1 }}
            >
              <option value="">Selecione a unidade_medida</option>
              {unidades.map(u => (
                <option key={u.id_unidade} value={u.id_unidade}>{u.nome}</option>
              ))}
            </select>
            <button type="button" className="cadastro-btn" style={{ padding: '6px 12px' }} onClick={() => setShowUnidadeModal(true)}>
              + Unidade
            </button>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              className={`cadastro-input ${form.quantidade ? 'has-val' : ''}`}
              placeholder="Quantidade"
              min="0.01"
              step="0.01"
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Quantidade"></span>
          </div>
          <div className="cadastro-btn-container">
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <button type="submit" className="cadastro-btn">
              Cadastrar Produto
            </button>
          </div>
        </form>
        {showUnidadeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
              <UnidadesMedida />
              <button className="cadastro-btn" style={{ marginTop: 16 }} onClick={() => setShowUnidadeModal(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CadastroDoacoes;
