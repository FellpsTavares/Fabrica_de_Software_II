import React, { useEffect, useState } from 'react';
import axios from 'axios';
import plano3 from './Assets/plano3.png';
import { useNavigate } from 'react-router-dom';
import MenuLateral from './Components/MenuLateral';
import { icons } from './Assets/Icons';

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
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box" style={{ maxWidth: 600, width: '100%', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 32 }}>
          <header className="header">
            <div className="header-left">
              <img src={require('./Assets/home.jpg')} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
              <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              </button>
            </div>
            <h2 style={{margin: 0}}>Estoque por Local</h2>
          </header>
          <div style={{ margin: '32px 0 24px 0', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
            <label htmlFor="estoque-select" style={{ fontWeight: 600, color: '#2e8b57', display: 'flex', alignItems: 'center', gap: 6 }}>
              {icons.estoqueLocal} Selecione o Estoque:
            </label>
            <select id="estoque-select" value={estoqueSelecionado} onChange={e => setEstoqueSelecionado(e.target.value)} style={{ padding: 10, borderRadius: 6, minWidth: 200, border: '1.5px solid #b2dfdb', fontSize: 16 }}>
              <option value="">Escolha um local</option>
              {estoques.map(est => (
                <option key={est.id_estoque} value={est.id_estoque}>{est.nome}</option>
              ))}
            </select>
            <button onClick={buscarEstoque} style={{ padding: '10px 22px', borderRadius: 6, background: '#2e8b57', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }} title="Buscar produtos do estoque">
              {icons.estoque} Buscar
            </button>
            <button onClick={() => navigate(-1)} style={{ padding: '10px 22px', borderRadius: 6, background: '#888', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }} title="Voltar para tela anterior">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              Voltar
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#2e8b57', fontWeight: 'bold', margin: 24, fontSize: 18 }}>Carregando estoque...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: 12, minWidth: 120, color: '#2e8b57', fontWeight: 700, fontSize: 16 }}>Produto</th>
                    <th style={{ padding: 12, minWidth: 80, color: '#2e8b57', fontWeight: 700, fontSize: 16 }}>Quantidade</th>
                    <th style={{ padding: 12, minWidth: 80, color: '#2e8b57', fontWeight: 700, fontSize: 16 }}>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  {buscou && estoque.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 28, fontSize: 17 }}>Nenhum produto encontrado para este estoque</td></tr>
                  ) : (
                    estoque.map(item => (
                      <tr key={item.id_produto} style={item.quantidade === 0 ? { background: '#ffeaea' } : {}}>
                        <td style={{ padding: 12 }}>{item.nome}</td>
                        <td style={{ padding: 12, color: item.quantidade === 0 ? '#c00' : '#222', fontWeight: item.quantidade === 0 ? 'bold' : 'normal', fontSize: 16 }}>{item.quantidade}</td>
                        <td style={{ padding: 12 }}>{item.unidade_nome}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EstoqueLocal;
