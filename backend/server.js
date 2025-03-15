const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Addres = require("../Backend/Model/Address.js");

// carrega as variaveis de ambiente do arquivo .ENV
dotenv.config();

// Cria uma instancia do Express -> Servidor
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem para req.
  res.header("Access-Control-Allow-Methods", "GET", "POST"); //permite apenas metodos GET e POST
  res.header("Access-Control-Allow-Headers", "Content-type"); //Permite o cabeçalho nas req.
  next();
});

//JSON nas requisições / Config do Express
app.use(express.json());

app.get("/api/cep/:cep", async (req, res) => {
  const { cep } = req.params; // Extrai o Cep

  try {
    //requisição GET para API ViaCep, passando um Cep
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    res.json(response.data); //retorno da API a resposta conforme o cep
  } catch (error) {
    res.status(500).json({ Error: "Erro ao buscar o CEP!" }); //em caso de erro
  }
});

app.post("/api/address", async (req, res) => {
  // corpo que deve ser enviado:
  const { cep, logradouro, bairro, cidade, estado } = req.body;

  try {
    const newAddress = new Address({ cep, logradouro, bairro, cidade, estado });
    await newAddress.save(); //salva o enderreço no banco de dados
    // retorna sucesso com os dados salvos
    res
      .status(201)
      .json({ message: "Endereço salvo com sucesso!", data: newAddress });
  } catch (error) {
    //retorna erro se não salvar
    res.status(500).json({ error: "Erro ao salvar o endereço" });
  }
});

// OBTEM  as variaveis do .ENV
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Define o link de conexão com o mongoDb Atlas
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.fpwjd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`;

// porta que roda o servidor
const port = 3000;

mongoose
  .connect(mongoURI) // Conecta ao banco de dados com o link gerado
  .then(() => {
    // quando for conexão bem sucedida
    console.log("Conectou ao Banco");
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })

  .catch((err) => console.log("Erro ao conectar no MongoDB", err));
