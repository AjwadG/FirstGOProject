import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const API_URL = "http://localhost:8000/api/todos";
export default API_URL;

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById("root")
);
