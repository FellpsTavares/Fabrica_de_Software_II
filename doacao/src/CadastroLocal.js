import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroLocal.css';
import fundo from './Assets/Fundo.png';
import { estadosECidades } from './Infos/LocaisBrasil';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";

function CadastroLocal() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    nome_local: '',
    funcionarios: '',
    endereco: '',
    telefone: '',
    coordenador: '',
    uf: estadosECidades.uf, // Mantém o valor inicial de GO
    cidade: ''
  });

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
    // Incluindo UF e Cidade nos dados a enviar, se necessário.
    // Se eles são apenas visuais como no código original, mantenha como está.
    // Se precisar enviar, adicione form.uf e form.cidade aqui.
    const dadosParaEnviar = {
      nome_local: form.nome_local,
      funcionarios: form.funcionarios,
      endereco: form.endereco,
      telefone: form.telefone,
      coordenador: form.coordenador,
      usuario_id // Envia o usuário logado
      // Adicione se necessário:
      // uf: form.uf, 
      // cidade: form.cidade
    };

    try {
      // Ajuste a URL e o endpoint conforme necessário
      const res = await axios.post(
        'http://127.0.0.1:8000/cadastrar_local/', 
        dadosParaEnviar,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(res.data.message || 'Local cadastrado com sucesso!');
      navigate('/cadastroLocal'); // Ou para onde deve ir após sucesso
    } catch (err) {
      console.error('Erro ao cadastrar local:', err.response?.data || err.message);
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box">
          <form onSubmit={handleSubmit} className="cadastro-form">

            {/* Campos existentes com label animado */}
            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="nome_local"
                value={form.nome_local}
                onChange={handleChange}
                className={`cadastro-input ${form.nome_local ? 'has-val' : ''}`}
                required // Adicionado required para exemplo
              />
              <span className="cadastro-focus-input" data-placeholder="Nome do Local"></span>
            </div>

            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="funcionarios"
                value={form.funcionarios}
                onChange={handleChange}
                className={`cadastro-input ${form.funcionarios ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder="Funcionários"></span>
            </div>

            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                className={`cadastro-input ${form.endereco ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder="Endereço"></span>
            </div>

            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className={`cadastro-input ${form.telefone ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder="Telefone"></span>
            </div>

            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="coordenador"
                value={form.coordenador}
                onChange={handleChange}
                className={`cadastro-input ${form.coordenador ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder="Coordenador"></span>
            </div>

            {/* UF com label estático */}
            <div className="cadastro-input-wrap static-label-wrap">
              <label htmlFor="uf" className="static-label">UF</label>
              <select
                id="uf" // Adicionado id para o label
                name="uf"
                value={form.uf}
                onChange={handleChange} // Permitir alteração se necessário no futuro
                className="cadastro-input has-val" // has-val para manter estilo se já tiver valor
                disabled // Mantido desabilitado conforme original
              >
                {/* Se precisar habilitar, adicione mais options aqui */}
                <option value={estadosECidades.uf}>
                  {estadosECidades.estado} ({estadosECidades.uf})
                </option>
              </select>
              {/* Span ainda necessário para a linha inferior animada */}
              <span className="cadastro-focus-input"></span> 
            </div>

            {/* Cidade com label estático */}
            <div className="cadastro-input-wrap static-label-wrap">
              <label htmlFor="cidade" className="static-label">Cidade</label>
              <select
                id="cidade" // Adicionado id para o label
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className={`cadastro-input ${form.cidade ? 'has-val' : ''}`}
                required // Adicionado required para exemplo
              >
                <option value="">Selecione uma cidade</option>
                {estadosECidades.cidades.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
               {/* Span ainda necessário para a linha inferior animada */}
              <span className="cadastro-focus-input"></span>
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
    </>
  );
}

export default CadastroLocal;

