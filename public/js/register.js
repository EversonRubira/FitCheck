document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    //Obtem os valores dos campos do formulario
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const resposta = await fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({nome, email, password})  
               
    });

    const dados = await resposta.json();

    if(resposta.ok) {
        document.getElementById('mensagem').innerHTML = `<p style="color: green;">${dados.message}</p>`;
        document.getElementById("register-form").reset(); // Limpa o formulário após o envio
    }else {
        document.getElementById('mensagem').innerHTML = `<p style="color: red;">${dados.error}</p>`;
    }

    });
