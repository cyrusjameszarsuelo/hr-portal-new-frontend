import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
// import "primeflex/primeflex.css";
// import "primereact/resources/primereact.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
