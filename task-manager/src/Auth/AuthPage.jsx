import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import { CSSTransition } from "react-transition-group";
import Signup from "../components/Signup";
import { login, logout, checkAuth } from "./Auth";
import Home from "../components/Home";
import ForgotPassword from "../components/ForgotPassword";
import "./AuthPage.css";

const AuthPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [activeForm, setActiveForm] = useState("login");

  const toggleForm = () => {
    setIsLoginActive((prev) => !prev);
  };

  const forgotPasswordRef = useRef(null);
  const loginRef = useRef(null);

  if (isAuthenticated) {
    // return <Navigate to="/user/dashboard" />;
    const user = getUser();
    const role = user?.role;

    return role === "admin" ? (
      <Navigate to="/user/dashboard" />
    ) : (
      <Navigate to="/user/tasks" />
    );
  }

  return (
    <div>
      {/* {isAuthenticated ? (
        <Home onLogout={() => logout(setIsAuthenticated)} />
      ) : ( */}
      <section className="forms-section">
        {activeForm !== "forgotPassword" && (
          <div>
            <h1 className="section-title">Task Symphony</h1>
            <h2 className="tag-line">Harmonize Your Task</h2>
          </div>
        )}
        <div className="forms">
          {/* Forgot Password Form (Always Mounted, but Conditionally Visible) */}
          <CSSTransition
            in={activeForm === "forgotPassword"}
            timeout={500}
            classNames="fade"
            unmountOnExit
            nodeRef={forgotPasswordRef}
          >
            {/* {activeForm === "forgotPassword" && ( */}
            <div ref={forgotPasswordRef} className="form-wrapper is-active">
              {/* <button
                  type="button"
                  className="switcher switcher-login"
                  onClick={() => setActiveForm("login")}
                >
                  Back to Login
                  <span className="underline"></span>
                </button> */}
              <ForgotPassword switchToLogin={() => setActiveForm("login")} />
            </div>
            {/* )} */}
          </CSSTransition>

          <CSSTransition
            in={activeForm !== "forgotPassword"}
            timeout={500}
            classNames="fade"
            unmountOnExit
            nodeRef={loginRef}
          >
            {/* Login & Signup Forms (Toggled via toggleForm) */}
            {/* {activeForm !== "forgotPassword" && ( */}

            {/* Login Form */}
            <>
              <div
                ref={loginRef}
                className={`form-wrapper ${isLoginActive ? "is-active" : ""}`}
              >
                <button
                  type="button"
                  className="switcher switcher-login"
                  onClick={toggleForm}
                >
                  Login
                  <span className="underline"></span>
                </button>
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  switchToSignup={toggleForm}
                  switchToForgotPassword={() => setActiveForm("forgotPassword")}
                />
              </div>

              {/* Signup Form */}
              <div
                className={`form-wrapper ${!isLoginActive ? "is-active" : ""}`}
              >
                <button
                  type="button"
                  className="switcher switcher-signup"
                  onClick={toggleForm}
                >
                  Sign Up
                  <span className="underline"></span>
                </button>
                <Signup />
              </div>
            </>
          </CSSTransition>
        </div>
      </section>
      {/* )} */}
    </div>
  );
};

export default AuthPage;
