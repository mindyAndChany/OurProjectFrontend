import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";       // ← חובה
import { STORE } from './redux/store.js';     // ← אתה כבר מייבא נכון
import "./tailwind.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={STORE}>                    {/* ← עוטף את האפליקציה */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
