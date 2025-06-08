import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fundo from './Assets/Fundo.png';

function CadastroSaidaDoacao() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [membroId, setMembroId] = useState(null);
  const [membroNome, setMembroNome] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Buscar produtos ao montar
  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/listar_produtos/')
      .then(res => setProdutos(res.data))
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
      await axios.post('http://127.0.0.1:8000/cadastrar_distribuicao_produto/', {
        membro_id: membroId,
        produto_id: produtoId,
        quantidade: quantidadeNum, // envia como número
        usuario_id: 1, // TODO: pegar do usuário logado
        estoque_id: 1  // TODO: selecionar ou inferir estoque
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
          // Tenta pegar a primeira mensagem de erro do objeto
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
      // Mensagem customizada para erro de quantidade NoneType
      if (mensagemErro && mensagemErro.toString().includes('float() argument must be a string or a real number')) {
        mensagemErro = 'Quantidade inválida: informe um valor numérico maior que zero.';
      }
      setErro(mensagemErro);
    }
  };

  return (
    <div className="cadastro-container" style={{ backgroundImage: `url(${fundo})` }}>
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
  );
}

export default CadastroSaidaDoacao;
