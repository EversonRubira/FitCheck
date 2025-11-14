document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const mensagemDiv = document.getElementById('mensagem');

    // Obter valores dos campos
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validação do lado do cliente
    if (!nome || nome.length < 2) {
        mensagemDiv.innerHTML = '<p style="color: red;">Nome deve ter no mínimo 2 caracteres.</p>';
        return;
    }

    if (!email || !email.includes('@')) {
        mensagemDiv.innerHTML = '<p style="color: red;">Digite um email válido.</p>';
        return;
    }

    if (!password || password.length < 8) {
        mensagemDiv.innerHTML = '<p style="color: red;">Senha deve ter no mínimo 8 caracteres.</p>';
        return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        mensagemDiv.innerHTML = '<p style="color: red;">Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.</p>';
        return;
    }

    // Mostrar loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';
    mensagemDiv.innerHTML = '<p style="color: blue;">Processando registro...</p>';

    try {
        const resposta = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, password })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemDiv.innerHTML = `<p style="color: green;">✓ ${dados.message}</p>`;
            document.getElementById("register-form").reset();

            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        } else {
            // Mostrar detalhes de validação se disponível
            if (dados.details && Array.isArray(dados.details)) {
                const erros = dados.details.map(d => d.msg).join('<br>');
                mensagemDiv.innerHTML = `<p style="color: red;">✗ ${erros}</p>`;
            } else {
                mensagemDiv.innerHTML = `<p style="color: red;">✗ ${dados.error}</p>`;
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrar';
        }
    } catch (erro) {
        console.error('Erro ao registrar:', erro);
        mensagemDiv.innerHTML = '<p style="color: red;">✗ Erro de conexão. Tente novamente.</p>';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar';
    }
});
