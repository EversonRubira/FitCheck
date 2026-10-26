// analise.js – Recebe a análise da IA em streaming (SSE) e exibe com efeito de digitação
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('analise-texto');
  if (!container) return;

  const cursor = container.querySelector('.cursor');
  const estado = document.getElementById('analise-estado');
  const fila = [];
  let aRevelar = false;
  let terminou = false;
  let recebeuTexto = false;

  function marcarEstado(texto, classe) {
    if (!estado) return;
    estado.textContent = texto;
    estado.className = 'an-status' + (classe ? ' ' + classe : '');
  }

  function revelarProximo() {
    if (fila.length === 0) {
      aRevelar = false;
      if (terminou && cursor) cursor.remove();
      return;
    }
    aRevelar = true;
    const char = fila.shift();
    cursor.insertAdjacentText('beforebegin', char);
    setTimeout(revelarProximo, 15);
  }

  function adicionarTexto(texto) {
    fila.push(...Array.from(texto));
    if (!aRevelar) revelarProximo();
  }

  // Marca o fim da ligação. O cursor sai quando a fila de letras esvaziar.
  function terminar() {
    terminou = true;
    if (!aRevelar && cursor) cursor.remove();
  }

  const origem = new EventSource('/registros/analise/stream');

  origem.addEventListener('chunk', (evento) => {
    const { texto } = JSON.parse(evento.data);
    if (!recebeuTexto) {
      recebeuTexto = true;
      marcarEstado('A escrever a análise...');
    }
    adicionarTexto(texto);
  });

  origem.addEventListener('limite', (evento) => {
    const { mensagem } = JSON.parse(evento.data);
    container.textContent = mensagem;
    marcarEstado('Limite atingido', 'is-error');
    origem.close();
  });

  // Erro enviado pelo servidor: mostra a mensagem e fecha a conexão
  origem.addEventListener('erro', (evento) => {
    const { mensagem } = JSON.parse(evento.data);
    adicionarTexto(`\n${mensagem}`);
    marcarEstado('Análise interrompida', 'is-error');
    origem.close();
    terminar();
  });

  origem.addEventListener('done', () => {
    marcarEstado('Análise concluída', 'is-done');
    origem.close();
    terminar();
  });

  // Conexão perdida sem aviso do servidor: informa o utilizador
  origem.onerror = () => {
    origem.close();
    console.log("Conexão SSE fechada inesperadamente.");
    marcarEstado('Ligação perdida', 'is-error');
    adicionarTexto("\nConexão perdida. Por favor, recarregue a página para tentar novamente.");
    terminar();
  };
});
