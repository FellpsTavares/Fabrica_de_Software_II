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
  const [locais, setLocais] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Recupera usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const tipoUsuario = (usuarioLogado?.tipo || '').trim().toUpperCase();
  const localUsuario = usuarioLogado?.local_nome || usuarioLogado?.local || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tipoUsuario === 'MASTER') {
      axios.get('http://127.0.0.1:8000/listar_locais/')
        .then(res => setLocais(res.data))
        .catch(() => setLocais([]));
    } else {
      // Para COORDENADOR/OPERACAO, busca estoque do local vinculado
      buscarEstoqueUsuario();
    }
    // eslint-disable-next-line
  }, []);

  const buscarEstoqueUsuario = async () => {
    setLoading(true);
    setBuscou(true);
    try {
      // Buscar id do estoque pelo nome do local
      const estoquesRes = await axios.get('http://127.0.0.1:8000/listar_estoques/');
      const estoqueLocal = estoquesRes.data.find(e => (e.nome || '').toLowerCase() === (localUsuario || '').toLowerCase());
      if (estoqueLocal) {
        setLocalSelecionado(estoqueLocal);
        const res = await axios.get(`http://127.0.0.1:8000/estoque_local/?estoque_id=${estoqueLocal.id_estoque}`);
        setEstoque(res.data);
      } else {
        setEstoque([]);
      }
    } catch {
      setEstoque([]);
    }
    setLoading(false);
  };

  const buscarEstoqueLocal = (local) => {
    navigate('/estoque-local-estoque', { state: { local } });
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
                {usuarioLogado?.nome || 'Usuário'}
              </span>
              <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              </button>
            </div>
          </header>

          {/* MASTER: lista de locais com botão temático */}
          {tipoUsuario === 'MASTER' && (
            <div style={{ margin: '32px 0 24px 0' }}>
              <h3 style={{ textAlign: 'center', color: '#388e3c', marginBottom: 18 }}>Selecione um local para visualizar o estoque:</h3>
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                {locais.length === 0 && <div style={{ textAlign: 'center', color: '#aaa' }}>Nenhum local encontrado.</div>}
                {locais.map(local => (
                  <div key={local.id_local_entrega || local.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px 18px', marginBottom: 14, background: '#f8fff8' }}>
                    <span style={{ fontWeight: 600, fontSize: 17 }}>{local.nome_local}</span>
                    <button onClick={() => buscarEstoqueLocal(local)} style={{ background: '#2e8b57', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px #0001', padding: 0 }} title="Ver estoque deste local">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="7" width="18" height="13" rx="2"/>
                        <path d="M16 3v4M8 3v4"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabela de estoque (aparece após seleção ou direto para COORDENADOR/OPERACAO) */}
          {(tipoUsuario !== 'MASTER' || (tipoUsuario === 'MASTER' && localSelecionado)) && (
            <div className="estoque-local-tabela-area">
              <h3 style={{ textAlign: 'center', color: '#388e3c', marginBottom: 10 }}>
                Estoque do local: <span style={{ color: '#222' }}>{localSelecionado?.nome_local || localUsuario}</span>
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#2e8b57', fontWeight: 'bold', margin: 24, fontSize: 18 }}>Carregando estoque...</div>
              ) : (
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
              )}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 0 0' }}>
            <button onClick={() => navigate(-1)} className="estoque-local-btn voltar" title="Voltar para tela anterior" style={{ minWidth: 120, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#e57373', color: '#fff', fontWeight: 600, borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              Voltar
            </button>
          </div>
          <Rodape />
        </div>
      </div>
    </>
  );
}

export default EstoqueLocal;
