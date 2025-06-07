import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/Fundo.png';

function UnidadesMedida() {
  const [unidades, setUnidades] = useState([]);
  const [novaUnidade, setNovaUnidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Carrega unidades ao montar
  useEffect(() => {
    carregarUnidades();
  }, []);

  const carregarUnidades = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/listar_unidades_medida/');
      setUnidades(res.data);
    } catch {
      setUnidades([]);
    }
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setMensagem('');
    if (!novaUnidade.trim()) {
      setMensagem('Informe o nome da unidade!');
      return;
    }
    try {
      const res = await axios.post('http://127.0.0.1:8000/cadastrar_unidade_medida/', { nome: novaUnidade });
      setMensagem(res.data.message || 'Unidade cadastrada com sucesso!');
      setNovaUnidade('');
      carregarUnidades();
    } catch (err) {
      setMensagem(err.response?.data?.error || 'Erro ao cadastrar unidade.');
    }
  };

  const handleExcluir = async (id) => {
    setMensagem('');
    try {
      await axios.delete(`http://127.0.0.1:8000/excluir_unidade_medida/${id}/`);
      setMensagem('Unidade excluída com sucesso!');
      carregarUnidades();
    } catch {
      setMensagem('Erro ao excluir unidade.');
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Unidades de Medida</h2>
        <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            value={novaUnidade}
            onChange={e => setNovaUnidade(e.target.value)}
            className="cadastro-input"
            placeholder="Nova unidade de medida"
            style={{ flex: 1 }}
          />
          <button type="submit" className="cadastro-btn">Cadastrar</button>
        </form>
        {mensagem && <div style={{ marginBottom: 10, color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</div>}
        <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8 }}>Unidade</th>
              <th style={{ padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map(u => (
              <tr key={u.id_unidade}>
                <td style={{ padding: 8 }}>{u.nome}</td>
                <td style={{ padding: 8 }}>
                  <button className="cadastro-btn" style={{ background: '#c00', color: '#fff' }} onClick={() => handleExcluir(u.id_unidade)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UnidadesMedida;
