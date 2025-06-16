import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style/CadastroUser.css';
import plano3 from './Assets/plano3.png';
import homeLogo from './Assets/home.jpg';
import MenuLateral from './Components/MenuLateral';
import { useNavigate } from 'react-router-dom';
import Rodape from './Components/Rodape';

function CadastroPessoaAutorizada({ onSuccess }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [familiaBusca, setFamiliaBusca] = useState('');
  const [familias, setFamilias] = useState([]);
  const [familiaSelecionada, setFamiliaSelecionada] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Efeito para rolar automaticamente para o topo ao acessar a tela
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Busca famílias conforme digitação
  const handleFamiliaBusca = async (e) => {
    const valor = e.target.value;
    setFamiliaBusca(valor);
    setFamiliaSelecionada(null);
    if (valor.length >= 3) {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/buscar_familias/?q=${valor}`);
        setFamilias(res.data);
      } catch {
        setFamilias([]);
      }
    } else {
      setFamilias([]);
    }
  };

  const handleSelectFamilia = (familia) => {
    setFamiliaSelecionada(familia);
    setFamiliaBusca(familia.nome_familia);
    setFamilias([]);
  };

  const handleCpfBlur = async () => {
    if (cpf.length < 11) return;
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/buscar_pessoa_por_cpf/', { cpf });
      if (res.data && res.data.nome) {
        setNome(res.data.nome);
      } else {
        setNome('');
      }
    } catch {
      setNome('');
    }
    setLoading(false);
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
    if (!familiaSelecionada) {
      alert('Selecione uma família para autorizar a retirada!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/cadastrar_pessoa_autorizada/', {
        cpf,
        nome,
        familia_id: familiaSelecionada.id_familia,
        data_inicio: dataInicio,
        data_fim: dataFim || null,
        observacao,
        usuario_id // Envia o usuário logado
      });
      alert('Pessoa autorizada cadastrada com sucesso!');
      if (onSuccess) onSuccess();
      setCpf(''); setNome(''); setFamiliaBusca(''); setFamiliaSelecionada(null); setDataInicio(''); setDataFim(''); setObservacao('');
    } catch (err) {
      alert('Erro ao cadastrar pessoa autorizada.');
    }
    setLoading(false);
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
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastrar Pessoa Autorizada</h2>
          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="cpf"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                onBlur={handleCpfBlur}
                className={`cadastro-input ${cpf ? 'has-val' : ''}`}
                required
              />
              <span className="cadastro-focus-input" data-placeholder="CPF"></span>
            </div>
            <div className="cadastro-input-wrap">
              <input
                type="text"
                name="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className={`cadastro-input ${nome ? 'has-val' : ''}`}
                required
              />
              <span className="cadastro-focus-input" data-placeholder="Nome"></span>
            </div>
            <div className="cadastro-input-wrap" style={{ position: 'relative' }}>
              <input
                type="text"
                name="familia"
                value={familiaBusca}
                onChange={handleFamiliaBusca}
                className={`cadastro-input ${familiaBusca ? 'has-val' : ''}`}
                placeholder="Buscar família pelo nome"
                autoComplete="off"
                required
              />
              <span className="cadastro-focus-input" data-placeholder="Família para autorizar retirada"></span>
              {familias.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ccc',
                  zIndex: 10,
                  maxHeight: 150,
                  overflowY: 'auto',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0
                }}>
                  {familias.map(f => (
                    <li key={f.id_familia} style={{ padding: 8, cursor: 'pointer' }} onClick={() => handleSelectFamilia(f)}>
                      {f.nome_familia}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="cadastro-input-wrap">
              <input
                type="date"
                name="data_inicio"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className={`cadastro-input ${dataInicio ? 'has-val' : ''}`}
                required
              />
              <span className="cadastro-focus-input" data-placeholder="Data de Início"></span>
            </div>
            <div className="cadastro-input-wrap">
              <input
                type="date"
                name="data_fim"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className={`cadastro-input ${dataFim ? 'has-val' : ''}`}
              />
              <span className="cadastro-focus-input" data-placeholder="Data de Fim (opcional)"></span>
            </div>
            <div className="cadastro-input-wrap">
              <textarea
                name="observacao"
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
                className="cadastro-input"
                placeholder="Observação"
                style={{ minHeight: 60 }}
              />
            </div>
            <div className="cadastro-btn-container">
              <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
                Voltar
              </button>
              <button type="submit" className="cadastro-btn" disabled={loading}>Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default CadastroPessoaAutorizada;
