import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style/CadastroFamilia.css';
import fundo from './Assets/Fundo.png';

function AlterarFamilia() {
  const [familias, setFamilias] = useState([]);
  const [familiaSelecionada, setFamiliaSelecionada] = useState(null);
  const [membros, setMembros] = useState([]);
  const [novoMembro, setNovoMembro] = useState({ nome: '', cpf: '', data_nascimento: '', pode_receber: false });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca todas as famílias sem filtro de busca
    axios.get('http://127.0.0.1:8000/buscar_familias/?q=aaa')
      .then(res => setFamilias(res.data))
      .catch(() => setFamilias([]));
  }, []);

  // Corrige: não buscar membros nem mostrar membros na tela de seleção, só redireciona
  const handleSelecionarFamilia = (e) => {
    const id = e.target.value;
    setFamiliaSelecionada(id);
    if (id) {
      navigate(`/editar-familia/${id}`);
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="cadastro-box">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Alterar Família</h2>
        <div className="cadastro-input-wrap">
          <select value={familiaSelecionada || ''} onChange={handleSelecionarFamilia} className="cadastro-input">
            <option value="">Selecione uma família</option>
            {familias.map(f => (
              <option key={f.id_familia} value={f.id_familia}>{f.nome_familia}</option>
            ))}
          </select>
        </div>
        <div className="cadastro-btn-container" style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
          <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)} style={{ transition: 'background 0.2s', background: '#e57373' }}
            onMouseOver={e => e.currentTarget.style.background = '#c62828'}
            onMouseOut={e => e.currentTarget.style.background = '#e57373'}>
            Voltar
          </button>
        </div>
        {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
        {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
      </div>
    </div>
  );
}

export default AlterarFamilia;
