document.getElementById('imc-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const botao = document.querySelector("button[type='submit']");
    const resultadoDiv = document.getElementById('resultado');

    const peso = parseFloat(pesoInput.value);
    const altura = parseFloat(alturaInput.value);

    // Validações
    if (!peso || peso <= 0 || peso > 500) {
        resultadoDiv.innerHTML = '<p style="color: red;">Peso inválido. Digite um valor entre 1 e 500 kg.</p>';
        return;
    }

    if (!altura || altura <= 0 || altura > 3) {
        resultadoDiv.innerHTML = '<p style="color: red;">Altura inválida. Digite um valor entre 0.5 e 3 metros.</p>';
        return;
    }

    // Desabilitar botão durante o processo
    botao.disabled = true;
    botao.textContent = 'Calculando...';

    // Calcular IMC
    const imc = (peso / (altura * altura)).toFixed(2);
    let classificacao = "";

    if (imc < 18.5) classificacao = "Magreza";
    else if (imc < 24.9) classificacao = "Normal";
    else if (imc < 29.9) classificacao = "Sobrepeso";
    else classificacao = "Obesidade";

    // Cores baseadas na classificação
    let cor = "#4CAF50"; // Verde (Normal)
    if (imc < 18.5) cor = "#FFC107"; // Amarelo (Magreza)
    else if (imc >= 25 && imc < 30) cor = "#FF9800"; // Laranja (Sobrepeso)
    else if (imc >= 30) cor = "#F44336"; // Vermelho (Obesidade)

    resultadoDiv.innerHTML = `
        <p style="font-size: 1.2em; color: ${cor};">
            Seu IMC é <strong>${imc}</strong> - ${classificacao}
        </p>
        <p style="font-size: 0.9em; color: #666;">Salvando resultado...</p>
    `;

    try {
        // Salvar no banco de dados
        const resposta = await fetch('/imc/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ peso, altura, imc: parseFloat(imc), classificacao })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            resultadoDiv.innerHTML = `
                <p style="font-size: 1.2em; color: ${cor};">
                    ✓ Seu IMC é <strong>${imc}</strong> - ${classificacao}
                </p>
                <p style="font-size: 0.9em; color: #4CAF50;">Resultado salvo com sucesso!</p>
                <button onclick="window.location.href='/historico.html'" style="margin-top: 10px;">
                    Ver Histórico
                </button>
            `;
        } else {
            // Se não estiver autenticado
            if (resposta.status === 401) {
                resultadoDiv.innerHTML = `
                    <p style="font-size: 1.2em; color: ${cor};">
                        Seu IMC é <strong>${imc}</strong> - ${classificacao}
                    </p>
                    <p style="font-size: 0.9em; color: #FF9800;">
                        ⚠ Faça login para salvar seus resultados
                    </p>
                    <button onclick="window.location.href='/login.html'" style="margin-top: 10px;">
                        Fazer Login
                    </button>
                `;
            } else {
                resultadoDiv.innerHTML = `
                    <p style="font-size: 1.2em; color: ${cor};">
                        Seu IMC é <strong>${imc}</strong> - ${classificacao}
                    </p>
                    <p style="font-size: 0.9em; color: red;">✗ Erro ao salvar: ${dados.error}</p>
                `;
            }
        }
    } catch (erro) {
        console.error('Erro ao salvar IMC:', erro);
        resultadoDiv.innerHTML = `
            <p style="font-size: 1.2em; color: ${cor};">
                Seu IMC é <strong>${imc}</strong> - ${classificacao}
            </p>
            <p style="font-size: 0.9em; color: red;">✗ Erro de conexão ao salvar resultado</p>
        `;
    } finally {
        // Re-habilitar botão
        botao.disabled = false;
        botao.textContent = 'Calcular IMC';
    }
});
  