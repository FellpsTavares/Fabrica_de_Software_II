import React, { useState } from 'react';
import axios from 'axios';
import './Style/CadastroUser.css';
import fundo from './Assets/Fundo.png';

function CadastroPessoaAutorizada({ onSuccess }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [familiaBusca, setFamiliaBusca] = useState('');
  const [familias, setFamilias] = useState([]);
  const [familiaSelecionada, setFamiliaSelecionada] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  // Busca famílias conforme digitação
  const handleFamiliaBusca = async (e) => {
    const valor = e.target.value;
    setFamiliaBusca(valor);
    setFamiliaSelecionada(null);
    if (valor.length >= 3) {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/buscar_familias/?q=${valor}`);
        setFamilias(res.data);
      } catch {
        setFamilias([]);
      }
    } else {
      setFamilias([]);
    }
  };

  const handleSelectFamilia = (familia) => {
    setFamiliaSelecionada(familia);
    setFamiliaBusca(familia.nome_familia);
    setFamilias([]);
  };

  const handleCpfBlur = async () => {
    if (cpf.length < 11) return;
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/buscar_pessoa_por_cpf/', { cpf });
      if (res.data && res.data.nome) {
        setNome(res.data.nome);
      } else {
        setNome('');
      }
    } catch {
      setNome('');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!familiaSelecionada) {
      alert('Selecione uma família para autorizar a retirada!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/cadastrar_pessoa_autorizada/', {
        cpf,
        nome,
        familia_id: familiaSelecionada.id_familia,
        data_inicio: dataInicio,
        data_fim: dataFim || null,
        observacao,
      });
      alert('Pessoa autorizada cadastrada com sucesso!');
      if (onSuccess) onSuccess();
      setCpf(''); setNome(''); setFamiliaBusca(''); setFamiliaSelecionada(null); setDataInicio(''); setDataFim(''); setObservacao('');
    } catch (err) {
      alert('Erro ao cadastrar pessoa autorizada.');
    }
    setLoading(false);
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastrar Pessoa Autorizada</h2>
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="cpf"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              onBlur={handleCpfBlur}
              className={`cadastro-input ${cpf ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="CPF"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="text"
              name="nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className={`cadastro-input ${nome ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Nome"></span>
          </div>
          <div className="cadastro-input-wrap" style={{ position: 'relative' }}>
            <input
              type="text"
              name="familia"
              value={familiaBusca}
              onChange={handleFamiliaBusca}
              className={`cadastro-input ${familiaBusca ? 'has-val' : ''}`}
              placeholder="Buscar família pelo nome"
              autoComplete="off"
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Família para autorizar retirada"></span>
            {familias.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                zIndex: 10,
                maxHeight: 150,
                overflowY: 'auto',
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}>
                {familias.map(f => (
                  <li key={f.id_familia} style={{ padding: 8, cursor: 'pointer' }} onClick={() => handleSelectFamilia(f)}>
                    {f.nome_familia}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="date"
              name="data_inicio"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              className={`cadastro-input ${dataInicio ? 'has-val' : ''}`}
              required
            />
            <span className="cadastro-focus-input" data-placeholder="Data de Início"></span>
          </div>
          <div className="cadastro-input-wrap">
            <input
              type="date"
              name="data_fim"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              className={`cadastro-input ${dataFim ? 'has-val' : ''}`}
            />
            <span className="cadastro-focus-input" data-placeholder="Data de Fim (opcional)"></span>
          </div>
          <div className="cadastro-input-wrap">
            <textarea
              name="observacao"
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              className="cadastro-input"
              placeholder="Observação"
              style={{ minHeight: 60 }}
            />
          </div>
          <div className="cadastro-btn-container">
            <button type="submit" className="cadastro-btn" disabled={loading}>Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroPessoaAutorizada;
