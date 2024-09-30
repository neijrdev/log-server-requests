// axiosInterceptor.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-url.com", // Substitua pela sua URL base
});

api.interceptors.request.use(
  (config) => {
    const logData = {
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

api.interceptors.response.use(
  (response) => {
    const logData = {
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
