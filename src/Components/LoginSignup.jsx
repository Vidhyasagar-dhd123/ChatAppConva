import React, { useEffect, useState, useRef } from "react";
import "../styles/LoginSignup.css";

const LoginSignup = ({auth,getAuth}) => {
  const [isSignup, setIsSignup] = useState(false);
  const formRef = useRef(null);
  
  useEffect(() => {
    const form = formRef.current;

    const handleSubmit = async (event) => {
      event.preventDefault();
      const username = form.elements["username"].value;
      const password = form.elements["password"].value;
      
      const url = isSignup
        ? "/api/register"
        : "/api/login";
      if (isSignup)
      try {
        const name = form.elements["name"].value
        const email = form.elements["email"].value
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password,name ,email}),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Success!");
          console.log(data);
          window.location.href=data.redirect
        } else {
          const error = await response.json();
          alert(error.error || "Operation failed!");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
      }
      else try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password}),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Success!");
          console.log(data);
          window.location.href=data.redirect
        } else {
          const error = await response.json();
          alert(error.error || "Operation failed!");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
      }
    };

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
    };
  }, [isSignup]);
  const toggleForm = () => setIsSignup(!isSignup);
    if(auth) return <b>Already Login</b>
    else
  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Welcome to <span className="highlight">Conva</span></h1>
        <p>{isSignup ? "Create your account" : "Log in to your account"}</p>
      </div>

      <form className="auth-form" ref={formRef}>
        {isSignup && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Username</label>
          <input type="text" id="username" placeholder="Enter your username" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
        {isSignup && (
          <div className="form-group">
            <label>Repeat Password</label>
            <input id="checkPass" type="password" placeholder="Repeat your password" />
          </div>
        )}
        <button type="submit" className="form-btn">
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <div className="toggle-link">
        {isSignup ? (
          <p>
            Already have an account?{" "}
            <span onClick={toggleForm} className="link">
              Log In
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span onClick={toggleForm} className="link">
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
