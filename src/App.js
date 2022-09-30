import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Dashboard";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import { useState } from "react";

function App() {
  const [user, setUser] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(false);

  return (
    <>
      <AppProvider i18n={enTranslations}>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                user={user}
                setUser={setUser}
                error={error}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                token={token}
                setToken={setToken}
              />
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={user}
                setUser={setUser}
                error={error}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                token={token}
                setToken={setToken}
              />
            }
          ></Route>
        </Routes>
      </AppProvider>
    </>
  );
}

export default App;
