// Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import { api } from "../auth";


const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    localStorage.setItem("token", data.token);

    navigate("/feed");
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <div className="container">
      <div className="login">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="FormLogin">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div className="FormLogin">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Vous n'avez pas encore de compte ? <Link to="/register">Inscription</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
