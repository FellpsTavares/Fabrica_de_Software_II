import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroUser.css';  // reutilizando o mesmo CSS
import fundo from './Assets/Fundo.png';

function CadastroFamilia() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_familia: '',
    nome_responsavel: '',
    endereco: '',
    cpf_responsavel: '',
    tipo_recebimento: 'estipulado',
    renda_familia: '',
    quantidade_integrantes: '',
    tipo_moradia: '',
    telefone: '',
    status: 'ativo',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/cadastrar_familia/',
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert(res.data.message || 'Família cadastrada com sucesso!');
      navigate('/cadastroFamilia'); // ajuste para sua rota desejada

    } catch (err) {
      console.error('Erro ao cadastrar família:', err.response?.data || err.message);
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">

          {[
            { name: 'nome_familia', label: 'Nome da Família' },
            { name: 'nome_responsavel', label: 'Responsável' },
            { name: 'endereco', label: 'Endereço' },
            { name: 'cpf_responsavel', label: 'CPF Responsável' },
            { name: 'renda_familia', label: 'Renda da Família', type: 'number' },
            { name: 'quantidade_integrantes', label: 'Qtd. Membros', type: 'number' },
            { name: 'tipo_moradia', label: 'Tipo de Moradia' },
            { name: 'telefone', label: 'Telefone' },
          ].map(({ name, label, type }) => (
            <div key={name} className="cadastro-input-wrap">
              <input
                type={type || 'text'}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`cadastro-input ${form[name] ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder={label}></span>
            </div>
          ))}

          {/* Tipo de Recebimento */}
          <div className="cadastro-input-wrap">
            <select
              name="tipo_recebimento"
              value={form.tipo_recebimento}
              onChange={handleChange}
              className="cadastro-input has-val"
            >
              <option value="estipulado">Estipulado</option>
              <option value="nao_estipulado">Não Estipulado</option>
            </select>
            <span className="cadastro-focus-input" data-placeholder="Tipo de Recebimento"></span>
          </div>

          {/* Status */}
          <div className="cadastro-input-wrap">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="cadastro-input has-val"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
            <span className="cadastro-focus-input" data-placeholder="Status"></span>
          </div>

          {/* Botões */}
          <div className="cadastro-btn-container">
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
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

export default CadastroFamilia;
