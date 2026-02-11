// Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../auth";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Basic password validation
  const passwordValid = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    const pwdError = passwordValid(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
  const res = await fetch("http://localhost:3001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Registration failed");
  }

  const data = await res.json();

  
  localStorage.setItem("token", data.token);

  navigate("/feed");
} catch (err: any) {
  setError(err.message);
}

  };

  return (
    <div className="container">
      <div className="register">
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="FormRegister">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div className="FormRegister">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Pseudo"
            />
          </div>
          <div className="FormRegister">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
            />
            {/* Live password validation */}
            {password && (
              <p style={{ color: "orange", fontSize: "0.9rem" }}>
                {passwordValid(password)}
              </p>
            )}
          </div>
          <div className="FormRegister">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirmer votre mot de passe"
            />
            {/* Match validation */}
            {confirmPassword && confirmPassword !== password && (
              <p style={{ color: "orange", fontSize: "0.9rem" }}>
                Passwords do not match
              </p>
            )}
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Vous avez déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
