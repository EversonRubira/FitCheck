const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analisarSemana(registros) {
  try {
    const resumo = registros.map( r => `Data: ${r.data}, Sono: ${r.horasSono}h, Qualidade do Sono: ${r.qualidadeSono}, Água: ${r.aguaMl}ml, Humor: ${r.humor}, Atividade: ${r.tipoAtividade}, Intensidade: ${r.intensidade}, Alimentação: ${r.qualidadeAlimentacao}`).join('\n');
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      
      messages: [
        {
          role: "user",
          content: `És um assistente de saúde. Analisa estes registos e dá 3 sugestões curtas e objetivas em português (máximo 150 palavras):\n\n${resumo}`
        }
      ]
    });
    return response.choices[0]?.message?.content || "Não foi possível gerar análise.";
  } catch (error) {
    console.error("Erro ao chamar AI:", error);
    return "Erro ao processar análise.";
  }
}

module.exports = { analisarSemana };