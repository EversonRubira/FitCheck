document.getElementById('imc-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita recarregar a página
  
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
  
    if (!peso || !altura || altura <= 0) {
      alert("Preencha corretamente os campos!");
      return;
    }
  
    const imc = (peso / (altura * altura)).toFixed(2);
    let classificacao = "";
  
    if (imc < 18.5) classificacao = "Magreza";
    else if (imc < 24.9) classificacao = "Normal";
    else if (imc < 29.9) classificacao = "Sobrepeso";
    else classificacao = "Obesidade";
  
    document.getElementById('resultado').innerHTML =
      `<p>Seu IMC é <strong>${imc}</strong> (${classificacao})</p>`;

      // Salvar dados do imc para o banco de dados
      fetch('/imc/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ peso, altura, imc, classificacao })
      })
      .then(res => res.json())
      .then(dados => {
        console.log('Resposta do servidor:', dados.message || dados.error);
      })
      .catch(err => {
        console.error('Erro ao salvar ICM:', err);

      })
      
  });
  