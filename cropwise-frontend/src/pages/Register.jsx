import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/crop/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.username?.[0] ||
          data.password?.[0] ||
          data.detail ||
          "Registration failed. Please try again.";

        throw new Error(message);
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registered: true, username: form.username },
        });
      }, 800);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to start predicting crops."
      footer={
        <>
          Already registered? <Link to="/login">Log in</Link>
        </>
      }
    >
      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="notice notice-success" role="status">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="stack">
        <label className="field">
          <span>Username</span>
          <input
            value={form.username}
            onChange={update("username")}
            autoComplete="username"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={update("password")}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={form.confirm}
            onChange={update("confirm")}
            autoComplete="new-password"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}