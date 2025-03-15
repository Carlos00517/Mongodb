// const { resolve } = require("path");

document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numericos

  //Verifica se o cep tem exatamente 8 Dig
  if (cep.length !== 8) {
    alert("cep inválido, deve ter 8 digitos"); //Alerta se for inválido
    return; //Não  executar o código para baixo
  }

  try {
    //Faz uma requisição para o backend e a consulta do CEP informado
    const response = await fetch(`http://localhost:3000/api/cep/${cep}`);
    if (!response.ok) {
      //verifica se a resposta foi bem sucedida
      throw new Error("Erro ao buscar o cep"); //Erro ao falhar
    }

    // Converte  a resposta da req. para JSON
    const data = await response.json();

    //Verifica se o CEp retornado pela Api é inválido
    if (data.erro) {
      alert("Cep não encontrado!");
      return;
    }

    //Prenche os campos do formulário com dados retornados
    document.getElementById("logradouro").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("estado").value = data.uf;

    //Adiciona um fedback visual, alterando a cor da borda dos campos
    document.querySelectorAll(".form-group imput").forEach((imput) => {
      Input.style.bordercolor = "#6a11cb"; //Borda roxa ao CPF encontrado
    });
  } catch (error) {
    console.erro("Erro ao buscar o cep:", error); //Exibi o erro do console
    alert("Erro ao buscar i cep. Verifique o console para mais detalhes");
  }
});

document
  .getElementById("addressForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); //imprede o recarregamento da pagina ao enviar o formulario
 
    //obtem os valores dos campos do formularios e armazena
 
    const cep = document.getElementById("cep").value;
    const logradouro = document.getElementById("logradouro").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;
    try {
      // faz a requisição POST para o backend para salvar o endereço
      const response = await fetch("http://localhost:3000/api/adress", {
        method: "POST",
        headers: {
          "Conten-Type": "application/json", // Define o envio do conteudo como JSON
        },
        body: JSON.stringify({ cep, logradouro, bairro, cidade, estado }), // Envia os campos
      });
 
      if (!response.ok) {
        // verifica se a resposta foi bem-sucedida
        throw new error("Erro ao salvar o Endereçço!"); // Retorna um erro se falhar
      }
 
      // Converte a resposta req. em JSON
      const result = await response.json();
      alert(result.message); // Exibe a mesnagem de sucesso retornada pelo backend
  
      // Limpa os campos do formulario após o envio bem-sucedido
      document.getElementById("Addressform").reset();

      //Remove o feadback visual(borda colorida)
      document.querySelectorAll(".form-group input").forEach((input) => {
        input.style.bordercolor = "#ddd"; // Define a borda de vilta para o padrão
      });
    } catch (error) {
      console.error("Erro ao salvar o endereço", error);
      alert(
        "Erro ao salvar o endereço. Verifique o console para mais detalhes!."
      )
    }
  });


