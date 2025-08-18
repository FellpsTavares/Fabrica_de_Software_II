import React, { useEffect, useState } from 'react';
import axios from 'axios';
import plano3 from './Assets/plano3.png';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import Rodape from './Components/Rodape';
import './Style/EstoqueLocal.css';

function EstoqueLocalEstoque() {
  const navigate = useNavigate();
  const location = useLocation();
  const { local } = location.state || {};
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!local) return;
    async function fetchEstoque() {
      setLoading(true);
      try {
        const estoquesRes = await axios.get('http://127.0.0.1:8000/listar_estoques/');
        const estoqueLocal = estoquesRes.data.find(e => (e.nome || '').toLowerCase() === (local.nome_local || '').toLowerCase());
        if (estoqueLocal) {
          const res = await axios.get(`http://127.0.0.1:8000/estoque_local/?estoque_id=${estoqueLocal.id_estoque}`);
          setEstoque(res.data);
        } else {
          setEstoque([]);
        }
      } catch {
        setEstoque([]);
      }
      setLoading(false);
    }
    fetchEstoque();
  }, [local]);

  if (!local) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#c00', fontWeight: 600 }}>
        Local não informado. Volte e selecione um local.
      </div>
    );
  }

  return (
    <>
      <MenuLateral open={false} onClose={() => {}} />
      <div className="estoque-local-container">
        <div className="estoque-local-box" style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #0002', padding: 32 }}>
          <header className="header">
            <div className="header-left">
              <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
            </div>
            <h2>Estoque do Local</h2>
            <div className="header-user-area">
              <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              </button>
            </div>
          </header>
          <div style={{ textAlign: 'center', margin: '18px 0 28px 0', fontSize: 20, color: '#2e8b57', fontWeight: 600 }}>
            Consultando o estoque do local: <span style={{ color: '#222' }}>{local.nome_local}</span>
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
                  {estoque.length === 0 ? (
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

export default EstoqueLocalEstoque;
