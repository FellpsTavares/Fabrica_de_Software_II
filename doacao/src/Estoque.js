import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/Fundo.png';

function Estoque() {
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);

  useEffect(() => {
    async function fetchMovimentacoes() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/listar_movimentacoes_estoque/');
        const movimentacoes = res.data;
        setEntradas(movimentacoes.entradas);
        setSaidas(movimentacoes.saidas);
      } catch {
        setEntradas([]);
        setSaidas([]);
      }
    }
    fetchMovimentacoes();
  }, []);

  const renderLinha = (mov, tipo) => (
    <tr key={mov.id_movimentacao} style={{ background: tipo === 'entrada' ? '#e6f9ed' : '#ffeaea' }}>
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
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>Movimentação de Estoque</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ color: '#2e8b57', borderBottom: '2px solid #2e8b57', paddingBottom: 8 }}>Entradas</h3>
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
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
                  entradas.map(mov => renderLinha(mov, 'entrada'))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ width: '100%' }}>
            <h3 style={{ color: '#c00', borderBottom: '2px solid #c00', paddingBottom: 8 }}>Saídas</h3>
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
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
                  saidas.map(mov => renderLinha(mov, 'saida'))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estoque;
