import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroFamilia.css';  // reutilizando o mesmo CSS
import fundo from './Assets/Fundo.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";
import Rodape from './Components/Rodape'; // Importando o Rodape

function CadastroFamilia() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    // Objeto com todos os dados do formulário, incluindo Local como texto
    const dadosParaEnviar = {
      nome_familia: form.nome_familia,
      endereco: form.endereco,
      tipo_recebimento: form.tipo_recebimento,
      renda_familia: form.renda_familia,
      quantidade_integrantes: form.quantidade_integrantes,
      tipo_moradia: form.tipo_moradia,
      status: form.status,
      cadastrar_local: form.cadastrar_local,
      usuario_id // Envia o usuário logado
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
      navigate('/cadastroMembroFamiliar'); 

    } catch (err) {
      console.error('Erro ao cadastrar família:', err.response?.data || err.message);
      // A mensagem de erro que você viu pode aparecer aqui se a API rejeitar os dados
      alert('Erro: ' + (err.response?.data?.error || err.message || 'Ocorreu um erro inesperado')); 
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
        <h2>Assistência Social Digital</h2>
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
      <Rodape /> {/* Adicionando o Rodape aqui */}
    </>
  );
}

export default CadastroFamilia;

