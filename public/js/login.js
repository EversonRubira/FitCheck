document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const mensagemDiv = document.getElementById('mensagem');

    // Obter valores dos campos
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validação básica do lado do cliente
    if (!email || !email.includes('@')) {
        mensagemDiv.innerHTML = '<p style="color: red;">Digite um email válido.</p>';
        return;
    }

    if (!password) {
        mensagemDiv.innerHTML = '<p style="color: red;">Digite sua senha.</p>';
        return;
    }

    // Mostrar loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    mensagemDiv.innerHTML = '<p style="color: blue;">Autenticando...</p>';

    try {
        const resposta = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemDiv.innerHTML = `<p style="color: green;">✓ ${dados.message}</p>`;

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            // Tratamento especial para rate limiting
            if (resposta.status === 429) {
                mensagemDiv.innerHTML = '<p style="color: red;">✗ Muitas tentativas de login. Aguarde 15 minutos.</p>';
            } else {
                mensagemDiv.innerHTML = `<p style="color: red;">✗ ${dados.error}</p>`;
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        mensagemDiv.innerHTML = '<p style="color: red;">✗ Erro de conexão. Tente novamente.</p>';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
});