// script.js – Carrega os registos de IMC salvos
fetch('/dados.json')
  .then(res => res.json())
  .then(registros => {
    const ul = document.getElementById('registros');
    ul.innerHTML = '';

    registros.forEach(registro => {
      const li = document.createElement('li');
      li.textContent = `Peso: ${registro.peso} kg | Altura: ${registro.altura} m | IMC: ${registro.imc} (${new Date(registro.data).toLocaleString('pt-PT')})`;
      ul.appendChild(li);
    });
  })
  .catch(erro => {
    console.error('Erro ao carregar dados:', erro);
  });

