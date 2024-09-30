# Axios Logs WebSocket Server

Este projeto é uma aplicação Node.js que utiliza `express` e `socket.io` para exibir logs em tempo real de requisições feitas usando o Axios, com interceptores que capturam requisições e respostas e enviam os dados para o servidor de logs.

## Funcionalidades

- **Interceptores Axios**: Logs de requisições e respostas HTTP são capturados e enviados para o servidor via WebSocket.
- **WebSocket**: Logs são enviados em tempo real para o cliente e exibidos no front-end.
- **Interface de Visualização**: Exibe as requisições e respostas capturadas no front-end, com separação de abas para Headers e Payload da requisição e Headers e Response para a resposta.

## Instalação e Execução do Projeto

### 1. Pré-requisitos

- Node.js v14+ instalado.
- Yarn ou npm para gerenciamento de pacotes.

### 2. Clonando o projeto

Clone o repositório para a sua máquina local:

```bash
git clone https://github.com/seu-usuario/axios-logs-server.git
cd axios-logs-server
```

### 3. Instale as dependências

Utilize o Yarn ou npm para instalar as dependências:

```bash
# Usando Yarn
yarn install

# Usando npm
npm install
```

### 4. Execute o servidor

Após a instalação das dependências, execute o servidor:

```bash
# Usando Yarn
yarn start

# Usando npm
npm start
```

O servidor estará disponível em: [http://localhost:4000](http://localhost:4000)

### 5. Acesse a Interface de Logs

Abra um navegador e vá para [http://localhost:4000](http://localhost:4000) para visualizar as requisições e respostas interceptadas.

## Adicionando os Interceptores do Axios

Para utilizar os interceptores no seu projeto Axios, você pode seguir este exemplo abaixo. O Axios enviará automaticamente os logs de requisições e respostas para o servidor de logs via WebSocket.

### Exemplo de Axios com Interceptores

```javascript
import axios from "axios";

// Supondo que a sua configuração de API esteja em apiConfig
const {
  baseURL,
  headers: { axios: headers },
} = apiConfig;

const api = axios.create({
  baseURL,
  headers,
});

let requestIdCounter = 0;

// Função para gerar um ID único simples
function generateRequestId() {
  return `req-${Date.now()}-${requestIdCounter++}`;
}

// Interceptor de Requisição
api.interceptors.request.use(
  (config) => {
    const requestId = generateRequestId(); // Gera um ID único para a requisição
    config.headers["X-Request-ID"] = requestId; // Adiciona o ID único nos headers

    const logData = {
      requestId,
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      params: config.params,
      data: config.data,
    };

    // Enviando os dados da requisição interceptada para o servidor de logs
    axios
      .post("http://localhost:4000/logs", { type: "request", logData })
      .catch((error) => console.error("Error logging request", error));

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers["X-Request-ID"]; // Recupera o ID único da requisição

    const logData = {
      requestId, // Inclui o mesmo ID único da requisição
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: response.config,
    };

    // Enviando os dados da resposta interceptada para o servidor de logs
    axios
      .post("http://localhost:4000/logs", { type: "response", logData })
      .catch((error) => console.error("Error logging response", error));

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### Como Funciona

1. **Interceptores de Requisição**: Antes de cada requisição Axios, o interceptor adiciona um ID único (`X-Request-ID`) e envia os dados da requisição para o servidor de logs via uma requisição `POST` para `http://localhost:4000/logs`.

2. **Interceptores de Resposta**: Após receber a resposta da API, o interceptor recupera o `X-Request-ID` e envia os dados da resposta para o servidor de logs, também via uma requisição `POST`.

3. **Visualização no Front-End**: Os logs de requisições e respostas são enviados via WebSocket e exibidos na interface.

### Configurações

- **BaseURL e Headers**: O Axios é configurado com o `baseURL` e `headers` do seu projeto.
- **Servidor de Logs**: O servidor de logs está configurado para rodar localmente em `http://localhost:4000/logs`. Se estiver rodando em outro local ou porta, ajuste a URL no interceptor.

## Estrutura do Projeto

```bash
.
├── src/
│   ├── server.js        # Arquivo principal do servidor Express
│   ├── public/
│   │   └── index.html   # Interface do front-end para visualizar os logs
├── package.json         # Arquivo de configuração do projeto
├── README.md            # Documentação do projeto
```

## Dependências

- **Express**: Framework web para rodar o servidor.
- **Socket.io**: Para comunicação WebSocket em tempo real entre o servidor e o cliente.
- **Axios**: Biblioteca para fazer requisições HTTP, usada para interceptar e capturar logs de requisições e respostas.

## Contribuindo

Sinta-se à vontade para contribuir com melhorias. Faça um fork do projeto, crie uma branch para suas mudanças e envie um pull request.

---

### Autor

Este projeto foi criado como um exemplo de interceptação de requisições e respostas utilizando Axios e Socket.io.
