import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/EditarFamilia.css';
import fundo from './Assets/Fundo.png';
import homeLogo from './Assets/home.jpg';
import plano3 from './Assets/plano3.png';
import MenuLateral from './Components/MenuLateral';
import Rodape from './Components/Rodape';

function EditarFamilia() {
  const { id } = useParams();
  const [familia, setFamilia] = useState(null);
  const [membros, setMembros] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/buscar_familias/?q=`)
      .then(res => {
        const fam = res.data.find(f => String(f.id_familia) === String(id));
        setFamilia(fam);
      });
    axios.get(`http://127.0.0.1:8000/listar_membros_familia/?familia_id=${id}`)
      .then(res => {
        // Filtra apenas membros ativos
        setMembros((res.data || []).filter(m => m.ativo !== false));
      })
      .catch(() => setMembros([]));
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Função para editar membro
  const handleEditarMembro = (id_membro, campo, valor) => {
    setMembros(membros.map(m => m.id_membro === id_membro ? { ...m, [campo]: valor } : m));
  };

  // Função para salvar edição do membro
  const handleSalvarMembro = (membro) => {
    // Garante que data_nascimento seja string no formato YYYY-MM-DD
    let dataNascimento = '';
    if (typeof membro.data_nascimento === 'string') {
      dataNascimento = membro.data_nascimento;
    } else if (membro.data_nascimento instanceof Date) {
      dataNascimento = membro.data_nascimento.toISOString().slice(0, 10);
    } else {
      dataNascimento = '';
    }
    const payload = {
      id_membro: membro.id_membro,
      nome: membro.nome || '',
      cpf: membro.cpf || '',
      data_nascimento: dataNascimento,
      pode_receber: Boolean(membro.pode_receber)
    };
    if (!payload.id_membro || !payload.nome || !payload.cpf || !payload.data_nascimento) {
      setErro('Preencha todos os campos obrigatórios do membro.');
      return;
    }
    axios.post(`http://127.0.0.1:8000/editar_membro_familiar/`, payload)
      .then(() => {
        setSucesso('Membro atualizado com sucesso!');
        setErro('');
      })
      .catch((err) => {
        setErro('Erro ao atualizar membro. ' + (err.response?.data?.error || ''));
      });
  };

  // Função para excluir membro
  const handleExcluirMembro = async (membro) => {
    const motivo = window.prompt('Digite o motivo da exclusão deste membro:');
    if (!motivo) return;
    try {
      await axios.post('http://127.0.0.1:8000/excluir_membro_familiar/', {
        id_membro: membro.id_membro,
        motivo_exclusao: motivo
      });
      setMembros(membros.filter(m => m.id_membro !== membro.id_membro));
      setSucesso('Membro excluído com sucesso!');
      setErro('');
    } catch {
      setErro('Erro ao excluir membro.');
    }
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
        <h2>Edição da Família</h2>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 6}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            {JSON.parse(localStorage.getItem('usuarioLogado'))?.nome || 'Usuário'}
          </span>
          <button onClick={() => navigate(-1)} className="header-logout-btn" title="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>
      </header>
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minWidth: '100vw', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="cadastro-box" style={{ maxWidth: 950, width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Edição da Família</h2>
          {familia && (
            <div style={{ marginBottom: 20 }}>
              <b>Nome:</b> {familia.nome_familia}
            </div>
          )}
          <h3 style={{marginTop: 30, marginBottom: 15}}>Membros</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', background: '#f9f9f9', borderRadius: 8, boxShadow: '0 2px 8px #0001'}}>
              <thead>
                <tr style={{background: '#7fc98f', color: 'white'}}>
                  <th style={{padding: 8, borderRadius: '8px 0 0 0'}}>Nome</th>
                  <th style={{padding: 8}}>CPF</th>
                  <th style={{padding: 8}}>Nascimento</th>
                  <th style={{padding: 8}}>Pode receber?</th>
                  <th style={{padding: 8, borderRadius: '0 8px 0 0'}}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {membros.map(m => (
                  <tr key={m.id_membro} style={{borderBottom: '1px solid #e0e0e0'}}>
                    <td style={{padding: 6}}>
                      <input type="text" value={m.nome} onChange={e => handleEditarMembro(m.id_membro, 'nome', e.target.value)} className="cadastro-input" style={{width: '100%', minWidth: 90}} />
                    </td>
                    <td style={{padding: 6}}>
                      <input type="text" value={m.cpf} onChange={e => handleEditarMembro(m.id_membro, 'cpf', e.target.value)} className="cadastro-input" style={{width: '100%', minWidth: 90}} />
                    </td>
                    <td style={{padding: 6}}>
                      <input type="date" value={m.data_nascimento} onChange={e => handleEditarMembro(m.id_membro, 'data_nascimento', e.target.value)} className="cadastro-input" style={{width: '100%', minWidth: 110}} />
                    </td>
                    <td style={{padding: 6, textAlign: 'center'}}>
                      <input type="checkbox" checked={m.pode_receber} onChange={e => handleEditarMembro(m.id_membro, 'pode_receber', e.target.checked)} />
                    </td>
                    <td style={{padding: 6, textAlign: 'center'}}>
                      <button
                        style={{background: '#7fc98f', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', cursor: 'pointer', transition: 'background 0.2s'}}
                        onMouseOver={e => e.currentTarget.style.background = '#388e3c'}
                        onMouseOut={e => e.currentTarget.style.background = '#7fc98f'}
                        onClick={() => handleSalvarMembro(m)}
                      >Salvar</button>
                      <button
                        style={{background: '#e57373', color: 'white', border: 'none', borderRadius: 5, padding: '6px 16px', cursor: 'pointer', marginLeft: 8, transition: 'background 0.2s'}}
                        onMouseOver={e => e.currentTarget.style.background = '#c62828'}
                        onMouseOut={e => e.currentTarget.style.background = '#e57373'}
                        onClick={() => handleExcluirMembro(m)}
                      >Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Aqui você pode adicionar botões para editar/remover membros, alterar dados, etc. */}
          {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
          {sucesso && <div style={{ color: 'green', marginTop: 10 }}>{sucesso}</div>}
          <div className="cadastro-btn-container" style={{ display: 'flex', gap: 10, marginTop: 30 }}>
            <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)} style={{ transition: 'background 0.2s', background: '#e57373' }}
              onMouseOver={e => e.currentTarget.style.background = '#c62828'}
              onMouseOut={e => e.currentTarget.style.background = '#e57373'}>
              Voltar
            </button>
            <button
              type="button"
              className="cadastro-btn"
              style={{ background: '#7fc98f', color: 'white', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#388e3c'}
              onMouseOut={e => e.currentTarget.style.background = '#7fc98f'}
              onClick={() => navigate(`/cadastroMembroFamiliar?familia_id=${id}`)}
            >
              Cadastrar novo membro
            </button>
          </div>
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default EditarFamilia;
