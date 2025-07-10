import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Auth/Auth";
import "./Login.css";

const Login = ({
  setIsAuthenticated,
  switchToSignup,
  switchToForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailPattern)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // console.log("Sending login payload:", { email, password });

        const response = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const data = await response.json();
          alert(data.message || "Login failed");
          return;
        }

        const data = await response.json();

        const userData = {
          name: data.name,
          email: data.email,
          role: data.role,
          profileImageUrl: data.profileImageUrl,
        };

        const token = data.token;
        // console.log("token info", token);

        // Store token and user info in sessionStorage
        login(setIsAuthenticated, userData, token); // pass token now

        navigate("/user/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Please check your email or password.");
      }
    }

    // try {
    //   const response = await axios.post(
    //     "http:http://localhost:8000/api/auth/login",
    //     {
    //       email,
    //       password,
    //     }
    //   );

    //   const { token, user } = response.data;

    //   if (token && user) {
    //     login(onLogin, user, token); //store token + user
    //     navigate("/user/dashboard"); //redirect to dashboard
    //   } else {
    //     alert("Login failed. Invalid credentials.");
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   alert("Login failed. Please check your email or password.");
    // }
    // const userData = {
    //   name: "John Doe", // Replace with actual user data if you have it. This could come from a real user DB later
    //   email: email,
    //   role: "admin", // or "user" — based on your logic
    //   profileImageUrl: "https://picsum.photos/100" || "/profile-2.jpg", // Optional placeholder
    // };
    // login(onLogin, userData);
    // navigate("/user/dashboard");
  };

  return (
    <form className="form form-login" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Please, enter your email and password for login.</legend>
        <div className="input-block">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-block">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="others">
          <p onClick={switchToSignup}>Need an account?</p>
          <p onClick={switchToForgotPassword} className="slow">
            Forgot Password?
          </p>
        </div>
      </fieldset>
      <button type="submit" className="btn-login">
        Login
      </button>
    </form>
  );
};

export default Login;
