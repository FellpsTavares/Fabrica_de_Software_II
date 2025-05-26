import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style/CadastroResponsavel.css'; // Importa o CSS correspondente
import fundo from './Assets/Fundo.png'; // Reutiliza o fundo se aplicável

function CadastroResponsavel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_responsavel: '',
    cpf_responsavel: '',
    telefone_responsavel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Adicionar máscara para CPF e Telefone se desejar
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Objeto com os dados a serem enviados
    const dadosParaEnviar = {
      nome: form.nome_responsavel,
      cpf: form.cpf_responsavel,
      telefone: form.telefone_responsavel
    };

    console.log("Dados a enviar:", dadosParaEnviar);
    alert("Dados do responsável (ver console):");

    // try {
    //   // Substitua pelo endpoint correto da sua API
    //   const res = await axios.post(
    //     'http://127.0.0.1:8000/cadastrar_responsavel/', 
    //     dadosParaEnviar,
    //     { headers: { 'Content-Type': 'application/json' } }
    //   );
    //   alert(res.data.message || 'Responsável cadastrado com sucesso!');
    //   navigate('/alguma-rota-apos-sucesso'); // Defina a rota de destino
    // } catch (err) {
    //   console.error('Erro ao cadastrar responsável:', err.response?.data || err.message);
    //   alert('Erro: ' + (err.response?.data?.error || err.message));
    // }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro de Responsável</h2>

          {/* Nome do Responsável */}
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome_responsavel"
              value={form.nome_responsavel}
              onChange={handleChange}
              className={`cadastro-input ${form.nome_responsavel ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Nome do responsável"></span>
          </div>

          {/* CPF do Responsável */}
          <div className="cadastro-input-wrap">
            <input
              type="text" // Pode usar type="tel" ou adicionar máscara
              name="cpf_responsavel"
              value={form.cpf_responsavel}
              onChange={handleChange}
              className={`cadastro-input ${form.cpf_responsavel ? 'has-val' : ''}`}
              required
              // Exemplo de pattern para CPF (simplificado):
              // pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
              // title="Digite um CPF válido (ex: 123.456.789-00)"
            />
            <span className="cadastro-focus-input" data-placeholder="CPF do responsável"></span>
          </div>

          {/* Telefone do Responsável */}
          <div className="cadastro-input-wrap">
            <input
              type="tel" // Tipo 'tel' é mais semântico
              name="telefone_responsavel"
              value={form.telefone_responsavel}
              onChange={handleChange}
              className={`cadastro-input ${form.telefone_responsavel ? 'has-val' : ''}`}
              required
              // Exemplo de pattern para telefone (simplificado):
              // pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}"
              // title="Digite um telefone válido (ex: (XX) 9XXXX-XXXX)"
            />
            <span className="cadastro-focus-input" data-placeholder="Telefone do responsável"></span>
          </div>

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

export default CadastroResponsavel;

