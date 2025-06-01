import './Style/Login.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import fundo from "./Assets/Fundo.png";
import ifg from "./Assets/IFG.png";
import logo from "./Assets/Logo.png";


function Login({ setIsAuthenticated }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Preencha email e senha!');
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/login_usuario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        alert(data.error || 'Usuário ou senha inválidos!');
      }
    } catch (err) {
      alert('Erro ao tentar logar: ' + err.message);
    }
  };

  return (
    <div 
    className="container"
    style={{ 
      backgroundImage: `url(${fundo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
  }}
>
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form">

            <span className="login-form-ifg">
              <img src={ifg} alt="Logo 'IFG'" />
            </span>

            <span className="login-form-title">
              <img src={logo} alt="Logo 'Gerenciamento de Doações'" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn"
              onClick={handleLogin}

              >
                Login

              </button>
            </div>

            <div className="text-center">
              <a href="/comum/solicitar_trocar_senha/" class="rememberPassword">Esqueceu ou deseja alterar sua senha?</a>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );

}

export default Login;
