import React, { useEffect, useState } from 'react';
import axios from 'axios';
import plano3 from './Assets/plano3.png';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import Rodape from './Components/Rodape';
import jsPDF from 'jspdf';
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

  // Função para gerar PDF do recibo de saída
  const gerarReciboPDF = async (mov) => {
    let nomeFamilia = mov.familia_nome || mov.nome_familia || null;
    if (!nomeFamilia && mov.membro_id) {
      let familiaId = null;
      try {
        const resMembro = await axios.get(`http://127.0.0.1:8000/membro_familiar/${mov.membro_id}/`);
        if (resMembro.data && resMembro.data.familia_id) {
          familiaId = resMembro.data.familia_id;
        }
        if (familiaId) {
          const resFamilia = await axios.get(`http://127.0.0.1:8000/familia/${familiaId}/`);
          if (resFamilia.data && resFamilia.data.nome_familia) {
            nomeFamilia = resFamilia.data.nome_familia;
          }
        }
      } catch (e) {}
    }
    if (!nomeFamilia) nomeFamilia = 'Familia Buscapé';

    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.text('Recibo de Doação', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    let y = 40;
    const usuario = mov.usuario_nome || '-';
    const pessoa = mov.membro_nome || '-';
    const quantidade = mov.quantidade || '-';
    const unidade = mov.unidade_nome || '-';
    const produto = mov.produto_nome || '-';
    const dataHora = new Date(mov.data_movimentacao).toLocaleString('pt-BR');
    doc.text(`Eu, ${usuario}, informo que ${pessoa} recebeu ${quantidade} ${unidade} do produto ${produto} aos ${dataHora}, responsável pela família: ${nomeFamilia}.`, 15, y, { maxWidth: 180 });
    y += 30;
    const assinaturaInicio = 35;
    const assinaturaFim = assinaturaInicio + 140;
    doc.line(assinaturaInicio, y, assinaturaFim, y);
    y += 10;
    doc.text('Assinatura', assinaturaInicio + 50, y);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    window.open(blobUrl, '_blank');
  };

function EstoqueMovimentacaoLocal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { local } = location.state || {};
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!local) return;
    async function fetchMovimentacoes() {
      setLoading(true);
      try {
        const estoquesRes = await axios.get('http://127.0.0.1:8000/listar_estoques/');
        const estoqueLocal = estoquesRes.data.find(e => (e.nome || '').toLowerCase() === (local.nome_local || '').toLowerCase());
        if (!estoqueLocal) {
          setEntradas([]);
          setSaidas([]);
          setLoading(false);
          return;
        }
        const resMov = await axios.get('http://127.0.0.1:8000/listar_movimentacoes_estoque/');
        const movimentacoes = resMov.data;
        const entradas = movimentacoes.entradas.filter(mov => mov.estoque_destino_id === estoqueLocal.id_estoque);
        const saidas = movimentacoes.saidas.filter(mov => mov.estoque_origem_id === estoqueLocal.id_estoque);
        setEntradas(entradas);
        setSaidas(saidas);
      } catch {
        setEntradas([]);
        setSaidas([]);
      }
      setLoading(false);
    }
    fetchMovimentacoes();
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
      <div className="estoque-local-container" style={{ minHeight: '100vh', background: `url(${plano3}) center/cover no-repeat, #f5f5f5` }}>
        <div className="estoque-local-box" style={{ maxWidth: 1100, margin: '40px auto', background: 'rgba(255,255,255,0.97)', borderRadius: 12, boxShadow: '0 4px 24px #0002', padding: 32 }}>
          <header className="header">
            <div className="header-left">
              <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
            </div>
            <h2>Movimentações do Estoque</h2>
            <div className="header-user-area">
              <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
              </button>
            </div>
          </header>
          <div style={{ textAlign: 'center', margin: '18px 0 28px 0', fontSize: 20, color: '#2e8b57', fontWeight: 600 }}>
            Consultando movimentações do local: <span style={{ color: '#222' }}>{local.nome_local}</span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#2e8b57', fontWeight: 'bold', margin: 24, fontSize: 18 }}>Carregando movimentações...</div>
          ) : (
            <>
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ color: '#2e8b57', borderBottom: '2px solid #2e8b57', paddingBottom: 8 }}>Entradas</h3>
                <div style={{ overflowX: 'auto', minHeight: 220 }}>
                  <table className="tabela-estoque" style={{ width: '100%', borderCollapse: 'collapse', minHeight: 180 }}>
                    <thead>
                      <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Produto</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Quantidade</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Usuário</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Membro</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Data</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57' }}>Tipo</th>
                        <th style={{ padding: 10, borderBottom: '2px solid #2e8b57', textAlign: 'center' }}>Recibo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entradas.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma entrada registrada</td></tr>
                      ) : (
                        entradas.map((mov, idx) => (
                          <tr key={mov.id_movimentacao} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                            <td style={{ padding: 8 }}>{mov.produto_nome}</td>
                            <td style={{ padding: 8 }}>{mov.quantidade} {mov.unidade_nome ? mov.unidade_nome : ''}</td>
                            <td style={{ padding: 8 }}>{mov.usuario_nome}</td>
                            <td style={{ padding: 8 }}>{mov.membro_nome ? mov.membro_nome : '-'}</td>
                            <td style={{ padding: 8 }}>{new Date(mov.data_movimentacao).toLocaleString('pt-BR')}</td>
                            <td style={{ padding: 8 }}><span style={{ color: '#2e8b57', fontWeight: 'bold' }}>Entrada &#8593;</span></td>
                            <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'middle', display: 'flex', gap: 8, justifyContent: 'center' }}>
                              <button type="button" title="Gerar Recibo PDF" onClick={() => gerarReciboPDF(mov)} style={{ background: '#7fc98f', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', width: 40, height: 40 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="4" y="4" width="16" height="16" rx="3" fill="#43a047" stroke="#388e3c" strokeWidth="1.5"/>
                                  <path d="M8 8h8v8H8z" fill="#fff" stroke="#388e3c" strokeWidth="1.5"/>
                                  <path d="M12 12v4" stroke="#388e3c" strokeWidth="2.2"/>
                                  <path d="M10 14h4" stroke="#388e3c" strokeWidth="2.2"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
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
                        saidas.map((mov, idx) => (
                          <tr key={mov.id_movimentacao} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                            <td style={{ padding: 8 }}>{mov.produto_nome}</td>
                            <td style={{ padding: 8 }}>{mov.quantidade} {mov.unidade_nome ? mov.unidade_nome : ''}</td>
                            <td style={{ padding: 8 }}>{mov.usuario_nome}</td>
                            <td style={{ padding: 8 }}>{mov.membro_nome}</td>
                            <td style={{ padding: 8 }}>{new Date(mov.data_movimentacao).toLocaleString('pt-BR')}</td>
                            <td style={{ padding: 8 }}><span style={{ color: '#c00', fontWeight: 'bold' }}>Saída &#8595;</span></td>
                            <td style={{ padding: 8, textAlign: 'center', verticalAlign: 'middle', display: 'flex', gap: 8, justifyContent: 'center' }}>
                              <label htmlFor={`file-upload-${mov.id_movimentacao}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                                <button type="button" title="Anexar Recibo" style={{ background: '#7fc98f', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', width: 40, height: 40 }}>
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
                              <button type="button" title="Gerar Recibo PDF" onClick={() => gerarReciboPDF(mov)} style={{ background: '#7fc98f', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', width: 40, height: 40 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="4" y="4" width="16" height="16" rx="3" fill="#43a047" stroke="#388e3c" strokeWidth="1.5"/>
                                  <path d="M8 8h8v8H8z" fill="#fff" stroke="#388e3c" strokeWidth="1.5"/>
                                  <path d="M12 12v4" stroke="#388e3c" strokeWidth="2.2"/>
                                  <path d="M10 14h4" stroke="#388e3c" strokeWidth="2.2"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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

export default EstoqueMovimentacaoLocal;
