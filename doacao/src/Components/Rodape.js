import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rodape.css';

const VERSAO_SISTEMA = '1.0.1';

export default function Rodape() {
  const [local, setLocal] = useState('');

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.id) return;
    axios.get(`http://127.0.0.1:8000/usuario_detalhe/${usuarioLogado.id}/`)
      .then(res => setLocal(res.data.local_nome || ''))
      .catch(() => setLocal(''));
  }, []);

  return (
    <footer className="rodape-sigeas">
      <span className="rodape-local">Local: <strong>{local || '---'}</strong></span>
      <span className="rodape-versao">Versão: {VERSAO_SISTEMA}</span>
    </footer>
  );
}
