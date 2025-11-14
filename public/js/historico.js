// Função para carregar histórico com paginação
let currentPage = 1;
const recordsPerPage = 10;

function carregarHistorico(page = 1) {
    fetch(`/imc/historico?page=${page}&limit=${recordsPerPage}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao carregar histórico');
            }
            return res.json();
        })
        .then(dados => {
            const tabela = document.querySelector('#tabela-historico tbody');
            tabela.innerHTML = ''; // Limpar tabela

            if (!dados.historico || dados.historico.length === 0) {
                tabela.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
                return;
            }

            // Renderizar registros
            dados.historico.forEach(item => {
                const linha = document.createElement('tr');
                const data = new Date(item.data_registro);
                const dataFormatada = data.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                linha.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${parseFloat(item.peso).toFixed(1)} kg</td>
                    <td>${parseFloat(item.altura).toFixed(2)} m</td>
                    <td>${parseFloat(item.imc).toFixed(2)}</td>
                    <td>${item.classificacao}</td>
                    <td>
                        <button onclick="deletarRegistro(${item.id})" class="btn-deletar">
                            Deletar
                        </button>
                    </td>
                `;
                tabela.appendChild(linha);
            });

            // Renderizar paginação
            renderizarPaginacao(dados.pagination);
        })
        .catch(err => {
            console.error('Erro ao carregar histórico:', err);
            const tabela = document.querySelector('#tabela-historico tbody');
            tabela.innerHTML = '<tr><td colspan="6" style="text-align:center; color: red;">Erro ao carregar histórico. Por favor, faça login.</td></tr>';
        });
}

// Função para renderizar paginação
function renderizarPaginacao(pagination) {
    const paginacaoDiv = document.getElementById('paginacao');
    if (!paginacaoDiv) return;

    paginacaoDiv.innerHTML = '';

    if (pagination.totalPages <= 1) return;

    // Botão anterior
    if (pagination.page > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '← Anterior';
        btnAnterior.onclick = () => carregarHistorico(pagination.page - 1);
        paginacaoDiv.appendChild(btnAnterior);
    }

    // Informação da página
    const info = document.createElement('span');
    info.textContent = `Página ${pagination.page} de ${pagination.totalPages}`;
    info.style.margin = '0 15px';
    paginacaoDiv.appendChild(info);

    // Botão próximo
    if (pagination.page < pagination.totalPages) {
        const btnProximo = document.createElement('button');
        btnProximo.textContent = 'Próximo →';
        btnProximo.onclick = () => carregarHistorico(pagination.page + 1);
        paginacaoDiv.appendChild(btnProximo);
    }
}

// Função para deletar registro
function deletarRegistro(id) {
    if (!confirm('Tem certeza que deseja deletar este registro?')) {
        return;
    }

    fetch(`/imc/deletar/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(dados => {
            alert(dados.message || 'Registro deletado com sucesso!');
            carregarHistorico(currentPage); // Recarregar página atual
        })
        .catch(err => {
            console.error('Erro ao deletar registro:', err);
            alert('Erro ao deletar registro.');
        });
}

// Carregar histórico ao abrir a página
carregarHistorico();

