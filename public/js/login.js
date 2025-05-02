document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    //Obtem os valores dos campos do formulario
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const resposta = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({email, password})  
               
    });

    const dados = await resposta.json();

    if(resposta.ok) {
        document.getElementById('mensagem').innerHTML = `<p style="color: green;">${dados.message}</p>`;

        setTimeout(() => {
            window.location.href = '/'; 
        }, 2000); // Redireciona após 2 segundos
    }else {
        document.getElementById('mensagem').innerHTML = `<p style="color: red;">${dados.error}</p>`;
    }

    });