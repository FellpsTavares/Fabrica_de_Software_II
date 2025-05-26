import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroFamilia.css';  // reutilizando o mesmo CSS
import fundo from './Assets/Fundo.png';

function CadastroFamilia() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_familia: '',
    endereco: '',
    tipo_recebimento: 'estipulado',
    renda_familia: '',
    quantidade_integrantes: '',
    tipo_moradia: '',
    status: 'ativo',
    Local: '', // Mantém no estado, agora para o input de texto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Objeto com todos os dados do formulário, incluindo Local como texto
    const dadosParaEnviar = {
      nome_familia: form.nome_familia,
      endereco: form.endereco,
      tipo_recebimento: form.tipo_recebimento,
      renda_familia: form.renda_familia,
      quantidade_integrantes: form.quantidade_integrantes,
      tipo_moradia: form.tipo_moradia,
      status: form.status,
      cadastrar_local: form.cadastrar_local
    };

    try {
      // Endpoint continua o mesmo: /cadastrar_familia/
      const res = await axios.post(
        'http://127.0.0.1:8000/cadastrar_familia/',
        dadosParaEnviar, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert(res.data.message || 'Família cadastrada com sucesso!');
      
      // Redireciona para CadastroResponsavel após sucesso
      navigate('/cadastroResponsavel'); 

    } catch (err) {
      console.error('Erro ao cadastrar família:', err.response?.data || err.message);
      // A mensagem de erro que você viu pode aparecer aqui se a API rejeitar os dados
      alert('Erro: ' + (err.response?.data?.error || err.message || 'Ocorreu um erro inesperado')); 
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Família</h2>

          {/* Campos de texto existentes */}
          {[
            { name: 'nome_familia', label: 'Nome da Família' },
            { name: 'endereco', label: 'Endereço' },
            { name: 'renda_familia', label: 'Renda da Família', type: 'number' },
            { name: 'quantidade_integrantes', label: 'Qtd. Membros', type: 'number' },
            { name: 'tipo_moradia', label: 'Tipo de Moradia' },
          ].map(({ name, label, type }) => (
            <div key={name} className="cadastro-input-wrap">
              <input
                type={type || 'text'}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`cadastro-input ${form[name] ? 'has-val' : ''}`}
                required 
              />
              <span className="cadastro-focus-input" data-placeholder={label}></span>
            </div>
          ))}

          {/* Tipo de Recebimento (Select) */}
          <div className="cadastro-input-wrap static-label-wrap">
            <label htmlFor="tipo_recebimento" className="static-label">Tipo de Recebimento</label>
            <select
              id="tipo_recebimento"
              name="tipo_recebimento"
              value={form.tipo_recebimento}
              onChange={handleChange}
              className="cadastro-input has-val"
            >
              <option value="estipulado">Estipulado</option>
              <option value="nao_estipulado">Não Estipulado</option>
            </select>
            <span className="cadastro-focus-input"></span>
          </div>

          {/* Status (Select) */}
          <div className="cadastro-input-wrap static-label-wrap">
             <label htmlFor="status" className="static-label">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="cadastro-input has-val"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
            <span className="cadastro-focus-input"></span>
          </div>

          {/* Local - MODIFICADO PARA INPUT TEXTO */}
          <div className="cadastro-input-wrap">
            <input
              type="text"
              id="cadastrar_local" // ID pode ser útil para labels ou testes
              name="cadastrar_local"
              value={form.cadastrar_local} // Conectado ao estado 'form.Local'
              onChange={handleChange}
              className={`cadastro-input ${form.Local ? 'has-val' : ''}`} // Estilo dinâmico
              
            />
            {/* Usa o placeholder animado padrão */}
            <span className="cadastro-focus-input" data-placeholder="Local de Retirada"></span>
          </div>

          {/* Botões */}
          <div className="cadastro-btn-container">
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <button type="submit" className="cadastro-btn">
              Cadastrar Família
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroFamilia;

