const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function montarMensagens(registros) {
  const resumo = registros.map( r => `Data: ${r.data}, Sono: ${r.horasSono}h, Qualidade do Sono: ${r.qualidadeSono}, Água: ${r.aguaMl}ml, Humor: ${r.humor}, Atividade: ${r.tipoAtividade}, Intensidade: ${r.intensidade}, Alimentação: ${r.qualidadeAlimentacao}`).join('\n');
  return [
    {
      role: "user",
      content: `És um assistente de saúde. Analisa estes registos e dá 3 sugestões curtas e objetivas em português (máximo 150 palavras):\n\n${resumo}`
    }
  ];
}

async function analisarSemana(registros) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: montarMensagens(registros)
    });
    return response.choices[0]?.message?.content || "Não foi possível gerar análise.";
  } catch (error) {
    console.error("Erro ao chamar AI:", error);
    return "Erro ao processar análise.";
  }
}

// Chama a Groq API em modo streaming, invocando onChunk a cada pedaço de texto recebido.
async function analisarSemanaStream(registros, onChunk) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: montarMensagens(registros),
    stream: true
  });

  for await (const parte of stream) {
    const texto = parte.choices[0]?.delta?.content || "";
    if (texto) onChunk(texto);
  }
}

module.exports = { analisarSemana, analisarSemanaStream };