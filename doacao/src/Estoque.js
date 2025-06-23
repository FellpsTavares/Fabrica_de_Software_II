import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/Fundo.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";
import { useNavigate } from 'react-router-dom';
import Rodape from './Components/Rodape';

function Estoque() {
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovimentacoes() {
      try {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado || !usuarioLogado.id) {
          setEntradas([]);
          setSaidas([]);
          return;
        }
        // Busca o local do usuário
        const resUser = await axios.get(`http://127.0.0.1:8000/usuario_detalhe/${usuarioLogado.id}/`);
        const localNome = resUser.data.local_nome;
        if (!localNome) {
          setEntradas([]);
          setSaidas([]);
          return;
        }
        // Busca o estoque do local
        const resEst = await axios.get('http://127.0.0.1:8000/listar_estoques/');
        const estoques = resEst.data;
        const estoqueUsuario = estoques.find(e => (e.nome || '').trim().toLowerCase() === (localNome || '').trim().toLowerCase());
        if (!estoqueUsuario) {
          setEntradas([]);
          setSaidas([]);
          return;
        }
        // Busca movimentações e filtra pelo estoque
        const resMov = await axios.get('http://127.0.0.1:8000/listar_movimentacoes_estoque/');
        const movimentacoes = resMov.data;
        const entradas = movimentacoes.entradas.filter(mov => mov.estoque_destino_id === estoqueUsuario.id_estoque);
        const saidas = movimentacoes.saidas.filter(mov => mov.estoque_origem_id === estoqueUsuario.id_estoque);
        setEntradas(entradas);
        setSaidas(saidas);
      } catch {
        setEntradas([]);
        setSaidas([]);
      }
    }
    fetchMovimentacoes();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Função para upload do recibo
  const handleUploadRecibo = async (file, id_movimentacao) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_movimentacao', id_movimentacao);
    try {
      await axios.post('http://127.0.0.1:8000/upload_recibo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Recibo anexado com sucesso!');
    } catch (err) {
      alert('Erro ao anexar recibo.');
    }
  };

  // Nova ordem: Produto | Quantidade | Usuário | Membro | Data | Tipo
  // Adiciona coluna para anexar recibo na tabela de saídas
  const renderLinha = (mov, tipo, idx) => (
    <tr key={mov.id_movimentacao} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
      <td style={{ padding: 8 }}>{mov.produto_nome}</td>
      <td style={{ padding: 8 }}>{mov.quantidade} {mov.unidade_nome ? mov.unidade_nome : ''}</td>
      <td style={{ padding: 8 }}>{mov.usuario_nome}</td>
      <td style={{ padding: 8 }}>{tipo === 'saida' ? mov.membro_nome : '-'}</td>
      <td style={{ padding: 8 }}>{new Date(mov.data_movimentacao).toLocaleString('pt-BR')}</td>
      <td style={{ padding: 8 }}>
        {tipo === 'entrada' ? (
          <span style={{ color: '#2e8b57', fontWeight: 'bold' }}>Entrada &#8593;</span>
        ) : (
          <span style={{ color: '#c00', fontWeight: 'bold' }}>Saída &#8595;</span>
        )}
      </td>
      {tipo === 'saida' && (
        <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'middle' }}>
          <label htmlFor={`file-upload-${mov.id_movimentacao}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
            <button type="button" title="Anexar Recibo" style={{ background: '#7fc98f', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#43a047" stroke="#388e3c" strokeWidth="1.5"/>
                <path d="M8 3h8a2 2 0 0 1 2 2v2" stroke="#388e3c" strokeWidth="1.5"/>
                <path d="M12 12v4" stroke="#fff" strokeWidth="2.2"/>
                <path d="M10 14h4" stroke="#fff" strokeWidth="2.2"/>
              </svg>
            </button>
            <input id={`file-upload-${mov.id_movimentacao}`} type="file" accept="application/pdf,image/*" style={{ display: 'none' }} onChange={e => {
              const file = e.target.files[0];
              handleUploadRecibo(file, mov.id_movimentacao);
            }} />
          </label>
        </td>
      )}
    </tr>
  );

  return (
    <div>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 10 }}>
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
          <button onClick={() => navigate(-1)} className="header-logout-btn estoque-btn voltar" title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', marginTop: 90, background: `url(${plano3}) center/cover no-repeat, #f5f5f5` }}>
        <div className="cadastro-box" style={{ maxWidth: 1100, width: '100%', background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 32, margin: 24 }}>
          <h2 style={{ color: '#2e8b57', marginBottom: 20 }}>Movimentação de Estoque do Seu Local</h2>
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ color: '#2e8b57', borderBottom: '2px solid #2e8b57', paddingBottom: 8 }}>Entradas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="tabela-estoque" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Produto</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Quantidade</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Usuário</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Membro</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Data</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma entrada registrada</td></tr>
                  ) : (
                    entradas.map((mov, idx) => renderLinha(mov, 'entrada', idx))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 style={{ color: '#c00', borderBottom: '2px solid #c00', paddingBottom: 8 }}>Saídas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="tabela-estoque" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Produto</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Quantidade</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Usuário</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Membro</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Data</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00' }}>Tipo</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #c00', textAlign: 'center' }}>Recibo</th>
                  </tr>
                </thead>
                <tbody>
                  {saidas.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma saída registrada</td></tr>
                  ) : (
                    saidas.map((mov, idx) => renderLinha(mov, 'saida', idx))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Rodape />
    </div>
  );
}

export default Estoque;
