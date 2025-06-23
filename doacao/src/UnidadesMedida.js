import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style/UnidadesMedidaModal.css';

function UnidadesMedidaModal({ open, onClose }) {
  const [unidades, setUnidades] = useState([]);
  const [novaUnidade, setNovaUnidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (open) {
      carregarUnidades();
      setMensagem('');
      setNovaUnidade('');
    }
  }, [open]);

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
      setMensagem('Não pode excluir esta unidade, pois ela está sendo usada em algum produto.');
    }
  };

  if (!open) return null;

  return (
    <div className="unidades-modal-overlay">
      <div className="unidades-modal-content">
        <button className="unidades-modal-close" onClick={onClose} title="Fechar">×</button>
        <div className="unidades-modal-title">Unidades de Medida</div>
        <form onSubmit={handleCadastrar} className="unidades-modal-form">
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
        {mensagem && <div className="unidades-modal-msg" style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</div>}
        <table className="unidades-modal-table">
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
                  <button className="unidades-modal-btn-excluir" onClick={() => handleExcluir(u.id_unidade)}>
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

export default UnidadesMedidaModal;
