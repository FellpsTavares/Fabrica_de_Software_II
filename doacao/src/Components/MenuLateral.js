import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '../Assets/Icons';
import './MenuLateral.css';

const opcoes = [
  { label: 'Cadastrar Usuários', icon: icons.usuario, path: '/Cadastro' },
  { label: 'Cadastrar Família', icon: icons.familia, path: '/CadastroFamilia' },
  { label: 'Cadastrar Local', icon: icons.local, path: '/CadastroLocal' },
  { label: 'Cadastro de Produto', icon: icons.produto, path: '/CadastroDoacoes' },
  { label: 'Saídas de Doações', icon: icons.saida, path: '/saidaDoacao' },
  { label: 'Visualizar Estoque', icon: icons.estoque, path: '/estoque' },
  { label: 'Cadastrar Pessoa Autorizada', icon: icons.autorizada, path: '/pessoa-autorizada' },
  { label: 'Alterar Família', icon: icons.alterar, path: '/alterarFamilia' },
  { label: 'Estoque por Local', icon: icons.estoqueLocal, path: '/estoque-local' },
];

export default function MenuLateral({ open, onClose }) {
  const navigate = useNavigate();
  return (
    <div className={`menu-lateral-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <nav className={`menu-lateral${open ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="menu-lateral-close" onClick={onClose} title="Fechar menu">×</button>
        <h3 className="menu-lateral-title">Menu</h3>
        <ul className="menu-lateral-list">
          {opcoes.map(op => (
            <li key={op.label} onClick={() => { navigate(op.path); onClose(); }} className="menu-lateral-item">
              <span className="menu-lateral-icon">{op.icon}</span>
              <span>{op.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
