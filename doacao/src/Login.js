import './Style/Login.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newLogo from "./Assets/newoldLogo.png";
import ifg from "./Assets/IFG.png";
import plano3 from "./Assets/plano3.png";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError('Preencha email e senha!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/login_usuario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
          id: data.id,
          nome: data.nome,
          tipo: data.tipo,
          local_id: data.local_id,
          local_nome: data.local_nome
        }));
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError(data.error || 'Usuário ou senha inválidos!');
      }
    } catch (err) {
      setError('Erro ao tentar logar: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-bg-green" style={{ background: `url(${plano3}) center/cover no-repeat` }}>
      <div className="login-modern-container">
        <div className="login-modern-header">
          <img src={newLogo} alt="SIGEAS Logo" className="login-modern-logo-main" />
          <div className="login-modern-title">
            <h1>SIGEAS</h1>
            <span>Gestão de Controle de Estoque com Doação</span>
          </div>
        </div>
        <form className="login-modern-form" onSubmit={handleLogin}>
          <div className="login-modern-form-title">
            <span className="login-modern-slogan">Inovação e Solidariedade em um só sistema</span>
          </div>
          <div className="login-modern-input-group">
            <input
              className={email !== "" ? "has-val login-modern-input" : "login-modern-input"}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Usuário"
              autoFocus
            />
          </div>
          <div className="login-modern-input-group">
            <input
              className={password !== "" ? "has-val login-modern-input" : "login-modern-input"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
            />
          </div>
          {error && <div className="login-modern-error">{error}</div>}
          <button className="login-modern-btn" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="login-modern-footer">
            <a href="/comum/solicitar_trocar_senha/" className="login-modern-link">Esqueceu ou deseja alterar sua senha?</a>
          </div>
        </form>
        <div className="login-modern-ifg">
          <img src={ifg} alt="Logo IFG" />
        </div>
      </div>
    </div>
  );
}

export default Login;
