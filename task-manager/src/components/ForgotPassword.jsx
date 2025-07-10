import React from "react";
import { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link has been sent to: ${email}`);
  };

  return (
    <section className="form-section">
      <h2>Forgot Password</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-details">
          <label htmlFor="email">Enter your registered email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Send Reset Link
        </button>
      </form>
      <p onClick={switchToLogin} className="link-button">
        Back To Login
      </p>
    </section>
  );
};

export default ForgotPassword;
