import React, { useEffect, useState } from 'react';
import axios from 'axios';
import plano3 from './Assets/plano3.png';
import { useNavigate } from 'react-router-dom';
import MenuLateral from './Components/MenuLateral';
import { icons } from './Assets/Icons';
import homeLogo from './Assets/home.jpg';
import Rodape from './Components/Rodape';
import './Style/EstoqueLocal.css';

function EstoqueLocal() {
  const [estoques, setEstoques] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/listar_estoques/')
      .then(res => setEstoques(res.data))
      .catch(() => setEstoques([]));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const buscarEstoque = async () => {
    if (!estoqueSelecionado) return;
    setLoading(true);
    setBuscou(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/estoque_local/?estoque_id=${estoqueSelecionado}`);
      setEstoque(res.data);
    } catch {
      setEstoque([]);
    }
    setLoading(false);
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="estoque-local-container">
        <div className="estoque-local-box">
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
          <div className="estoque-local-filtros">
            <label htmlFor="estoque-select" className="estoque-local-label">
              {icons.estoqueLocal} Selecione o Estoque:
            </label>
            <select id="estoque-select" value={estoqueSelecionado} onChange={e => setEstoqueSelecionado(e.target.value)} className="estoque-local-select">
              <option value="">Escolha um local</option>
              {estoques.map(est => (
                <option key={est.id_estoque} value={est.id_estoque}>{est.nome}</option>
              ))}
            </select>
            <button onClick={buscarEstoque} className="estoque-local-btn buscar" title="Buscar produtos do estoque">
              {icons.estoque} Buscar
            </button>
            <button onClick={() => navigate(-1)} className="estoque-local-btn voltar" title="Voltar para tela anterior">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              Voltar
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#2e8b57', fontWeight: 'bold', margin: 24, fontSize: 18 }}>Carregando estoque...</div>
          ) : (
            <div className="estoque-local-tabela-area">
              <table className="estoque-local-tabela">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  {buscou && estoque.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 28, fontSize: 17 }}>Nenhum produto encontrado para este estoque</td></tr>
                  ) : (
                    estoque.map(item => (
                      <tr key={item.id_produto} style={item.quantidade === 0 ? { background: '#ffeaea' } : {}}>
                        <td>{item.nome}</td>
                        <td style={{ color: item.quantidade === 0 ? '#c00' : '#222', fontWeight: item.quantidade === 0 ? 'bold' : 'normal', fontSize: 16 }}>{item.quantidade}</td>
                        <td>{item.unidade_nome}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Rodape />
        </div>
      </div>
    </>
  );
}

export default EstoqueLocal;
