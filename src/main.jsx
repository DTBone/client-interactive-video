// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store.js";


const GOOGLE_CLIENT_ID = '621276446588-2uh2c93nb5jnhje3u6q954bb1impgudk.apps.googleusercontent.com'

createRoot(document.getElementById("root")).render(
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {/* Nhớ gắn strictmode */}
          <CssBaseline />
          <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </Provider>
        </GoogleOAuthProvider>
);
