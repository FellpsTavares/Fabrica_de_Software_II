import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/Fundo.png';

function Estoque() {
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);

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

  const renderLinha = (mov, tipo, idx) => (
    <tr key={mov.id_movimentacao} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
      <td style={{ padding: 8 }}>{mov.produto_nome}</td>
      <td style={{ padding: 8 }}>{mov.usuario_nome}</td>
      <td style={{ padding: 8 }}>{tipo === 'saida' ? mov.membro_nome : '-'}</td>
      <td style={{ padding: 8 }}>
        {mov.quantidade} {mov.unidade_nome ? mov.unidade_nome : ''}
      </td>
      <td style={{ padding: 8 }}>{new Date(mov.data_movimentacao).toLocaleString('pt-BR')}</td>
      <td style={{ padding: 8 }}>
        {tipo === 'entrada' ? (
          <span style={{ color: '#2e8b57', fontWeight: 'bold' }}>Entrada &#8593;</span>
        ) : (
          <span style={{ color: '#c00', fontWeight: 'bold' }}>Saída &#8595;</span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="cadastro-box" style={{ maxWidth: 900, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>Movimentação de Estoque do Seu Local</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ color: '#2e8b57', borderBottom: '2px solid #2e8b57', paddingBottom: 8 }}>Entradas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 16 }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: 8 }}>Produto</th>
                    <th style={{ padding: 8 }}>Usuário</th>
                    <th style={{ padding: 8 }}>Membro</th>
                    <th style={{ padding: 8 }}>Quantidade</th>
                    <th style={{ padding: 8 }}>Data</th>
                    <th style={{ padding: 8 }}>Tipo</th>
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
          <div style={{ width: '100%' }}>
            <h3 style={{ color: '#c00', borderBottom: '2px solid #c00', paddingBottom: 8 }}>Saídas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: 8 }}>Produto</th>
                    <th style={{ padding: 8 }}>Usuário</th>
                    <th style={{ padding: 8 }}>Membro</th>
                    <th style={{ padding: 8 }}>Quantidade</th>
                    <th style={{ padding: 8 }}>Data</th>
                    <th style={{ padding: 8 }}>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {saidas.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Nenhuma saída registrada</td></tr>
                  ) : (
                    saidas.map((mov, idx) => renderLinha(mov, 'saida', idx))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estoque;
