import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fundo from './Assets/Fundo.png';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";
import Rodape from './Components/Rodape';

function CadastroSaidaDoacao() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cpf, setCpf] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [membroId, setMembroId] = useState(null);
  const [membroNome, setMembroNome] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [estoqueId, setEstoqueId] = useState('');

  // Buscar estoque do usuário logado ao montar
  React.useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.id) return setProdutos([]);
    // Busca o local do usuário pelo endpoint detalhado
    axios.get(`http://127.0.0.1:8000/usuario_detalhe/${usuarioLogado.id}/`)
      .then(resUser => {
        const localNome = resUser.data.local_nome;
        if (!localNome) return setProdutos([]);
        // Busca o estoque cujo nome é igual ao nome_local
        axios.get('http://127.0.0.1:8000/listar_estoques/')
          .then(res => {
            const estoques = res.data;
            const estoqueUsuario = estoques.find(e => (e.nome || '').trim().toLowerCase() === (localNome || '').trim().toLowerCase());
            if (estoqueUsuario) {
              setEstoqueId(estoqueUsuario.id_estoque);
              // Busca produtos desse estoque
              axios.get(`http://127.0.0.1:8000/listar_produtos/?estoque_id=${estoqueUsuario.id_estoque}`)
                .then(res2 => {
                  setProdutos(res2.data);
                })
                .catch(() => setProdutos([]));
            } else {
              setProdutos([]);
            }
          })
          .catch(() => setProdutos([]));
      })
      .catch(() => setProdutos([]));
  }, []);

  // Valida CPF e busca membro_id
  const handleBuscarMembro = async () => {
    setErroCpf('');
    setMembroId(null);
    setMembroNome('');
    if (!cpf) {
      setErroCpf('Informe o CPF!');
      return;
    }
    try {
      const res = await axios.post('http://127.0.0.1:8000/buscar_membro_por_cpf/', { cpf });
      if (res.data && res.data.id_membro) {
        setMembroId(res.data.id_membro);
        setMembroNome(res.data.nome);
      } else {
        setErroCpf('CPF não encontrado ou não autorizado!');
      }
    } catch {
      setErroCpf('CPF não encontrado ou não autorizado!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (!membroId) {
      setErro('Busque e valide o CPF antes de cadastrar!');
      return;
    }
    if (!produtoId || !quantidade) {
      setErro('Selecione o produto e a quantidade!');
      return;
    }
    // Validação extra: quantidade deve ser maior que zero
    const quantidadeNum = parseFloat(quantidade);
    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      setErro('Informe uma quantidade válida (maior que zero).');
      return;
    }
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const usuario_id = usuarioLogado?.id;
      if (!usuario_id) {
        setErro('Usuário não autenticado! Faça login novamente.');
        return;
      }
      await axios.post('http://127.0.0.1:8000/cadastrar_distribuicao_produto/', {
        membro_id: membroId,
        produto_id: produtoId,
        quantidade: quantidadeNum,
        usuario_id,
        estoque_id: estoqueId
      });
      setSucesso('Saída registrada com sucesso!');
      setCpf(''); setProdutoId(''); setQuantidade(''); setMembroId(null);
    } catch (err) {
      let mensagemErro = 'Erro ao registrar saída.';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.detail) {
          mensagemErro = err.response.data.detail;
        } else if (err.response.data.erro) {
          mensagemErro = err.response.data.erro;
        } else {
          const firstKey = Object.keys(err.response.data)[0];
          if (firstKey) {
            const val = err.response.data[firstKey];
            if (Array.isArray(val)) {
              mensagemErro = val[0];
            } else {
              mensagemErro = val;
            }
          }
        }
      }
      if (mensagemErro && mensagemErro.toString().includes('float() argument must be a string or a real number')) {
        mensagemErro = 'Quantidade inválida: informe um valor numérico maior que zero.';
      }
      setErro(mensagemErro);
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
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>Saída de Doação</h2>
            <div className="cadastro-input-wrap" style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <input
                type="text"
                name="cpf"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                className={`cadastro-input ${cpf ? 'has-val' : ''}`}
                placeholder="CPF da Pessoa que irá retirar a doação"
                style={{flex: 1}}
              />
              <button type="button" className="cadastro-btn" onClick={handleBuscarMembro}>
                Buscar CPF
              </button>
            </div>
            {erroCpf && <div style={{color: 'red', marginBottom: 10}}>{erroCpf}</div>}
            {membroNome && <div style={{color: 'green', marginBottom: 10}}>Membro válido! Nome: {membroNome}</div>}

            <div className="cadastro-input-wrap">
              <select
                name="produto"
                value={produtoId}
                onChange={e => setProdutoId(e.target.value)}
                className={`cadastro-input ${produtoId ? 'has-val' : ''}`}
              >
                <option value="">Selecione o Produto</option>
                {produtos.map(prod => (
                  <option key={prod.id_produto} value={prod.id_produto}>{prod.nome}</option>
                ))}
              </select>
            </div>

            <div className="cadastro-input-wrap">
              <input
                type="number"
                name="quantidade"
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
                className={`cadastro-input ${quantidade ? 'has-val' : ''}`}
                placeholder="Quantidade"
                min="0.01" step="0.01"
              />
            </div>

            {erro && <div style={{color: 'red', marginBottom: 10}}>{erro}</div>}
            {sucesso && <div style={{color: 'green', marginBottom: 10}}>{sucesso}</div>}

            <div className="cadastro-btn-container">
              <button type="button" className="cadastro-btn voltar-btn" onClick={() => navigate(-1)}>
                Voltar
              </button>
              <button type="submit" className="cadastro-btn">
                Registrar Saída
              </button>
            </div>
          </form>
        </div>
      </div>
      <Rodape />
    </>
  );
}

export default CadastroSaidaDoacao;
