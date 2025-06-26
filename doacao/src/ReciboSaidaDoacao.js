import React, { useRef } from 'react';
import jsPDF from 'jspdf';

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

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.text('Recibo de Doação', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    let y = 40;
    doc.text(`Eu, ${usuario}, informo que ${pessoa} recebeu ${quantidade} ${unidade} do produto ${produto} aos ${dataHora}, responsável pela família: ${nomeFamilia}.`, 15, y, { maxWidth: 180 });
    y += 30;

    // Linha de assinatura com 2/3 da largura da folha A4 (A4 = 210mm, 2/3 ≈ 140mm)
    const assinaturaInicio = 35;
    const assinaturaFim = assinaturaInicio + 140;
    doc.line(assinaturaInicio, y, assinaturaFim, y);
    y += 10;
    doc.text('Assinatura', assinaturaInicio + 50, y);

    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    window.open(blobUrl, '_blank');
  };

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
        <div style={{margin: '32px 0 18px 0', textAlign: 'center'}}>
          {/* <div style={{marginBottom: 8, color: '#555'}}>Assinatura do responsável pelo recebimento:</div> */}
          <div style={{width: '100%', borderBottom: '2px solid #7fc98f', height: 32, margin: '0 auto'}}></div>
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 18}}>
          <button onClick={gerarPDF} style={{flex: 1, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8, height: 40, fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer'}}>Gerar PDF</button>
          <button onClick={onClose} style={{flex: 1, background: '#7fc98f', color: '#fff', border: 'none', borderRadius: 8, height: 40, fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer'}}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default ReciboSaidaDoacao;
