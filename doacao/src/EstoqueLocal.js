import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/Fundo.png';
import { useNavigate } from 'react-router-dom';

function EstoqueLocal() {
  const [estoques, setEstoques] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/listar_estoques/')
      .then(res => {
        setEstoques(res.data);
        console.log('Estoques recebidos:', res.data); // Adicionado para debug
      })
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
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="cadastro-box" style={{ maxWidth: 600, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>Estoque por Estoque</h2>
        <div style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <select value={estoqueSelecionado} onChange={e => setEstoqueSelecionado(e.target.value)} style={{ padding: 8, borderRadius: 4, minWidth: 200 }}>
            <option value="">Selecione o Estoque</option>
            {estoques.map(est => (
              <option key={est.id_estoque} value={est.id_estoque}>{est.nome}</option>
            ))}
          </select>
          <button onClick={buscarEstoque} style={{ padding: '8px 18px', borderRadius: 4, background: '#2e8b57', color: '#fff', border: 'none', fontWeight: 'bold' }}>Buscar</button>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 18px', borderRadius: 4, background: '#888', color: '#fff', border: 'none', fontWeight: 'bold' }}>Voltar</button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#2e8b57', fontWeight: 'bold', margin: 24 }}>Carregando estoque...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
                <tr>
                  <th style={{ padding: 10, minWidth: 120 }}>Produto</th>
                  <th style={{ padding: 10, minWidth: 80 }}>Quantidade</th>
                  <th style={{ padding: 10, minWidth: 80 }}>Unidade</th>
                </tr>
              </thead>
              <tbody>
                {buscou && estoque.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 24 }}>Nenhum produto encontrado para este estoque</td></tr>
                ) : (
                  estoque.map(item => (
                    <tr key={item.id_produto} style={item.quantidade === 0 ? { background: '#ffeaea' } : {}}>
                      <td style={{ padding: 10 }}>{item.nome}</td>
                      <td style={{ padding: 10, color: item.quantidade === 0 ? '#c00' : '#222', fontWeight: item.quantidade === 0 ? 'bold' : 'normal' }}>{item.quantidade}</td>
                      <td style={{ padding: 10 }}>{item.unidade_nome}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstoqueLocal;
