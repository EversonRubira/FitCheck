// analise.js – Recebe a análise da IA em streaming (SSE) e exibe com efeito de digitação
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('analise-texto');
  if (!container) return;

  const cursor = container.querySelector('.cursor');
  const fila = [];
  let aRevelar = false;
  let terminou = false;

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
    fila.push(...texto.split(''));
    if (!aRevelar) revelarProximo();
  }

  const origem = new EventSource('/registros/analise/stream');

  origem.addEventListener('chunk', (evento) => {
    const { texto } = JSON.parse(evento.data);
    adicionarTexto(texto);
  });

  origem.addEventListener('limite', (evento) => {
    const { mensagem } = JSON.parse(evento.data);
    container.textContent = mensagem;
    origem.close();
  });

  // Erro enviado pelo servidor: mostra a mensagem e fecha a conexão
  origem.addEventListener('erro', (evento) => {
    const { mensagem } = JSON.parse(evento.data);
    adicionarTexto(`\n${mensagem}`);
    origem.close();
  });

  origem.addEventListener('done', () => {
    origem.close();
  });

  // Conexão perdida sem aviso do servidor: informa o utilizador.
  // O cursor é removido pelo revelarProximo quando a mensagem acabar de ser escrita.
  origem.onerror = () => {
    origem.close();
    console.log("Conexão SSE fechada inesperadamente.");
    terminou = true;
    adicionarTexto("\nConexão perdida. Por favor, recarregue a página para tentar novamente.");
  };
});