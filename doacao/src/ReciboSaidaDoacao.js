import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import './Style/ReciboSaidaDoacao.css';

function ReciboSaidaDoacao({
  usuario,
  pessoa,
  quantidade,
  unidade,
  produto,
  dataHora,
  nomeFamilia,
  onClose
}) {
  const assinaturaRef = useRef(null);
  const qrRef = useRef();

  const gerarPDF = async () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.text('Recibo de Doação', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    let y = 35;
    // Tabela de informações
    const tableData = [
      ['Usuário', usuario],
      ['Pessoa', pessoa],
      ['Quantidade', `${quantidade} ${unidade}`],
      ['Produto', produto],
      ['Data/Hora', dataHora],
      ['Família', nomeFamilia],
    ];
    // Cabeçalho
    doc.setFillColor(220, 240, 220);
    doc.rect(15, y, 180, 10, 'F');
    doc.setTextColor(30, 100, 60);
    doc.text('Informações da Doação', 105, y + 7, { align: 'center' });
    y += 14;
    doc.setTextColor(0, 0, 0);
    // Linhas da tabela
    tableData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(String(value), 60, y);
      y += 9;
    });
    y += 6;
    // Gerar QR code base64 usando a lib 'qrcode'
    const imgData = await QRCode.toDataURL(qrData, { width: 120, margin: 2 });
  // Posição: canto inferior direito
  doc.addImage(imgData, 'PNG', 160, 250, 40, 40);
  // Linha de assinatura (ajustada para não sobrepor o QR code)
  const assinaturaInicio = 35;
  const assinaturaFim = assinaturaInicio + 140;
  const linhaY = 245; // valor ajustado para ficar acima do QR code
  doc.line(assinaturaInicio, linhaY, assinaturaFim, linhaY);
  doc.text('Assinatura', assinaturaInicio + 50, linhaY + 8);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    window.open(blobUrl, '_blank');
  };

  // Monta os dados do recibo para o QR Code
  const qrData = JSON.stringify({
    pessoa,
    nomeFamilia,
    produto,
    quantidade,
    dataHora
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0002',
        padding: 36, minWidth: 340, maxWidth: '96vw', width: 420, display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative'
      }}>
        <button onClick={onClose} style={{position: 'absolute', top: 16, right: 16, background: '#e57373', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.3rem', cursor: 'pointer'}}>×</button>
        <div style={{fontSize: '1.2rem', color: '#388e3c', marginBottom: 18, textAlign: 'center', fontWeight: 600}}>Recibo de Doação</div>
        <div style={{fontSize: '1.05rem', color: '#333', marginBottom: 24, lineHeight: 1.7}}>
          Eu, <b>{usuario}</b>, informo que <b>{pessoa}</b> recebeu <b>{quantidade} {unidade}</b> do produto <b>{produto}</b> aos <b>{dataHora}</b>, responsável pela família: <b>{nomeFamilia}</b>.
        </div>
        {/* Botões apenas */}
        <div style={{display: 'flex', gap: 12, marginTop: 18}}>
          <button onClick={gerarPDF} style={{flex: 1, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8, height: 40, fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer'}}>Gerar PDF</button>
          <button onClick={onClose} style={{flex: 1, background: '#7fc98f', color: '#fff', border: 'none', borderRadius: 8, height: 40, fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer'}}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default ReciboSaidaDoacao;
