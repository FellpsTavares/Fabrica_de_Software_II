import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style/CadastroUser.css';
import fundo from './Assets/Fundo.png';
import UnidadesMedida from './UnidadesMedida';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";
import Rodape from './Components/Rodape';

function CadastroDoacoes() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    unidade_id: '',
    quantidade: '',
    produto_id: ''
  });
  const [unidades, setUnidades] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [showUnidadeModal, setShowUnidadeModal] = useState(false);
  const [modo, setModo] = useState('entrada'); // Sempre inicia em 'entrada'
  const [estoqueId, setEstoqueId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Função para buscar produtos do estoque do local do usuário
  const fetchProdutos = async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.id) {
      setProdutos([]);
      return;
    }
    try {
      // Busca o local do usuário
      const resUser = await axios.get(`http://127.0.0.1:8000/usuario_detalhe/${usuarioLogado.id}/`);
      const localNome = (resUser.data.local_nome || '').trim().toLowerCase();
      if (!localNome) {
        setProdutos([]);
        return;
      }
      // Busca o estoque do local (ajuste: compara ignorando acentos e plural)
      const resEst = await axios.get('http://127.0.0.1:8000/listar_estoques/');
      const estoques = resEst.data;
      // Função para normalizar nomes
      const normalize = s => s.normalize('NFD').replace(/[ -]/g, '').replace(/s$/, '').trim().toLowerCase();
      const estoqueUsuario = estoques.find(e => normalize(e.nome) === normalize(localNome));
      if (estoqueUsuario) {
        setEstoqueId(estoqueUsuario.id_estoque);
        const res2 = await axios.get(`http://127.0.0.1:8000/listar_produtos/?estoque_id=${estoqueUsuario.id_estoque}`);
        setProdutos(res2.data);
      } else {
        setProdutos([]);
      }
    } catch {
      setProdutos([]);
    }
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/listar_unidades_medida/')
      .then(res => setUnidades(res.data))
      .catch(() => setUnidades([]));
    fetchProdutos();
  }, [showUnidadeModal]); // Atualiza ao fechar modal

  // Sempre que mudar para modo 'entrada', recarrega produtos
  useEffect(() => {
    if (modo === 'entrada') {
      fetchProdutos();
    }
  }, [modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Recupera usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const usuario_id = usuarioLogado?.id ? Number(usuarioLogado.id) : null;
    if (!usuario_id || isNaN(usuario_id)) {
      alert('Usuário não autenticado! Faça login novamente.');
      return;
    }
    if (modo === 'novo') {
      // Monta o JSON correto para novo produto
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        unidade_id: Number(form.unidade_id),
        quantidade: Number(form.quantidade),
        usuario_id // Envia o usuário logado
      };
      try {
        const res = await axios.post('http://127.0.0.1:8000/cadastrar_produto/', payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert(res.data.message || 'Produto cadastrado com sucesso!');
        setForm({ nome: '', descricao: '', unidade_id: '', quantidade: '', produto_id: '' });
        navigate('/home');
      } catch (err) {
        alert('Erro: ' + (err.response?.data?.error || err.message));
      }
    } else {
      // Adicionar quantidade a produto existente
      if (!form.produto_id || !form.quantidade) {
        alert('Selecione o produto e informe a quantidade!');
        return;
      }
      try {
        const payload = {
          produto_id: Number(form.produto_id),
          quantidade: Number(form.quantidade),
          tipo_movimentacao: 'entrada',
          usuario_id, // Envia o usuário logado
          estoque_destino_id: estoqueId // Corrigido: estoque correto do usuário
        };
        await axios.post('http://127.0.0.1:8000/cadastrar_movimentacao_estoque/', payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert('Quantidade adicionada com sucesso!');
        setForm({ nome: '', descricao: '', unidade_id: '', quantidade: '', produto_id: '' });
        navigate('/home');
      } catch (err) {
        alert('Erro: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <>
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
        <h2>Assistência Social Digital</h2>
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
      <div className="cadastro-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cadastro-box">
          <form onSubmit={handleSubmit} className="cadastro-form">
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Cadastro/Entrada de Produto</h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
              <button type="button" className={`cadastro-btn${modo === 'entrada' ? ' selecionado' : ''}`} onClick={() => setModo('entrada')}>Adicionar Quantidade</button>
              <button type="button" className={`cadastro-btn${modo === 'novo' ? ' selecionado' : ''}`} onClick={() => setModo('novo')}>Adicionar Novo Produto</button>
            </div>
            {modo === 'novo' ? (
              <>
                <div className="cadastro-input-wrap">
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className={`cadastro-input ${form.nome ? 'has-val' : ''}`}
                    required
                  />
                  <span className="cadastro-focus-input" data-placeholder="Nome do Produto"></span>
                </div>
                <div className="cadastro-input-wrap">
                  <input
                    type="text"
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    className={`cadastro-input ${form.descricao ? 'has-val' : ''}`}
                    required
                  />
                  <span className="cadastro-focus-input" data-placeholder="Descrição"></span>
                </div>
                <div className="cadastro-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    name="unidade_id"
                    value={form.unidade_id}
                    onChange={handleChange}
                    className={`cadastro-input ${form.unidade_id ? 'has-val' : ''}`}
                    required
                    style={{ flex: 1 }}
                  >
                    <option value="">Selecione a unidade_medida</option>
                    {unidades.map(u => (
                      <option key={u.id_unidade} value={u.id_unidade}>{u.nome}</option>
                    ))}
                  </select>
                  <button type="button" className="cadastro-btn" style={{ padding: '6px 12px' }} onClick={() => setShowUnidadeModal(true)}>
                    + Unidade
                  </button>
                </div>
                <div className="cadastro-input-wrap">
                  <input
                    type="number"
                    name="quantidade"
                    value={form.quantidade}
                    onChange={handleChange}
                    className={`cadastro-input ${form.quantidade ? 'has-val' : ''}`}
                    placeholder="Quantidade"
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <span className="cadastro-focus-input" data-placeholder="Quantidade"></span>
                </div>
              </>
            ) : (
              <>
                <div className="cadastro-input-wrap">
                  <select
                    name="produto_id"
                    value={form.produto_id || ''}
                    onChange={handleChange}
                    className={`cadastro-input ${form.produto_id ? 'has-val' : ''}`}
                    required
                  >
                    <option value="">Selecione o Produto</option>
                    {produtos.length === 0 && <option disabled value="">Nenhum produto disponível</option>}
                    {produtos.map(p => (
                      <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="cadastro-input-wrap">
                  <input
                    type="number"
                    name="quantidade"
                    value={form.quantidade}
                    onChange={handleChange}
                    className={`cadastro-input ${form.quantidade ? 'has-val' : ''}`}
                    placeholder="Quantidade a adicionar"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </>
            )}
            <div className="cadastro-btn-container">
              <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
                Voltar
              </button>
              <button type="submit" className="cadastro-btn">
                {modo === 'novo' ? 'Cadastrar Produto' : 'Adicionar Quantidade'}
              </button>
            </div>
          </form>
          {showUnidadeModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
                <UnidadesMedida />
                {/* Botão 'Fechar' removido */}
              </div>
            </div>
          )}
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default CadastroDoacoes;
