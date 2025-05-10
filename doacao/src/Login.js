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

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulação de login bem-sucedido
    if (email && password) {
      setIsAuthenticated(true);
      navigate('/home');
    } else {
      alert('Preencha email e senha!');
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
