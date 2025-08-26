import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    // On success navigate to home
    axios
      .post(
        "http://localhost:3000/api/auth/login",
        { email, password }, // request body
        { withCredentials: true } // config
      )
      .then((response) => {
        console.log(response.data);
        navigate("/"); // navigate only after success
      }) 
      .catch((error) => {
        console.error(error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="container">
      <div className="card" role="region" aria-label="Login form">
        <div className="brand">
          <div>
            <h1>Exact GPT</h1>
            <div className="lead">Sign in to your account</div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Controlled inputs and client-side validation */}
          <div className="form-row">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className={`input ${errors.email ? "error" : ""}`}
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className={`input ${errors.password ? "error" : ""}`}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="helper">
              Don't share your credentials with anyone.
            </div>
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <div className="actions" style={{ marginTop: 10 }}>
            <button
              className="btn"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link
              to="/register"
              className="btn ghost"
              aria-label="Create account"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
