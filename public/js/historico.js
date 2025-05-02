fetch('/imc/historico')
.then(res => res.json())
.then(dados => {
    const tabela = document.querySelector('#tabela-historico tbody');

    if (!dados.historico || dados.historico.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }
    dados.historico.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            
            <td>${new Date(item.data_registro).toLocaleDateString()}</td>
            <td>${item.id}</td>
            <td>${item.peso}</td>
            <td>${item.altura}</td>
            <td>${item.imc}</td>
            <td>${item.classificacao}</td>
        `;
        tabela.appendChild(linha);	

        
    });
})
.catch(err => {
    console.error('Erro ao carregar histórico:', err);

});

