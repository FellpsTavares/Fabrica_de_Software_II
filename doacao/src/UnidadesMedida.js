import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fundo from './Assets/plano3.png';
import './Style/UnidadesMedida.css';
import { useNavigate } from 'react-router-dom';

function UnidadesMedida() {
  const [unidades, setUnidades] = useState([]);
  const [novaUnidade, setNovaUnidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  // Carrega unidades ao montar
  useEffect(() => {
    carregarUnidades();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="unidades-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="unidades-box-horizontal">
        <div style={{display: 'flex', flexDirection: 'column', minWidth: 260, flex: 1}}>
          <button className="unidades-voltar-btn" onClick={() => navigate(-1)} title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
            Voltar
          </button>
          <h2 className="unidades-titulo">Unidades de Medida</h2>
          <form onSubmit={handleCadastrar} className="unidades-form-horizontal">
            <input
              type="text"
              value={novaUnidade}
              onChange={e => setNovaUnidade(e.target.value)}
              className="cadastro-input"
              placeholder="Nova unidade de medida"
            />
            <button type="submit" className="cadastro-btn">Cadastrar</button>
          </form>
          {mensagem && <div className="unidades-msg" style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</div>}
        </div>
        <div className="unidades-tabela-wrapper" style={{flex: 2}}>
          <table className="unidades-tabela">
            <thead>
              <tr>
                <th>Unidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {unidades.map(u => (
                <tr key={u.id_unidade}>
                  <td>{u.nome}</td>
                  <td>
                    <button className="cadastro-btn unidades-btn-excluir" onClick={() => handleExcluir(u.id_unidade)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UnidadesMedida;
