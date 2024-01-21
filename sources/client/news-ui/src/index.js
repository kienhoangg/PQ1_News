import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./app/store";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import frVN from "antd/es/locale/vi_VN";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyles>
        <ConfigProvider locale={frVN}>
          <App />
        </ConfigProvider>
      </GlobalStyles>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
