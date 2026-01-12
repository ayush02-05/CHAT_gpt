import React from "react";
import { useForm } from "react-hook-form";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUp({ onNavigate, onSignUp }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: {
        firstname: "",
        lastname: "",
      },
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (!data) return;

    const res = await axios.post("http://localhost:5000/user/register", data, {
      withCredentials: true,
    });
    if (res.status == 200) {
      toast.success("SingUp Successfully");
      navigate("/home");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="auth-card-container">
        <div className="auth-card glass-morphism">
          <div className="auth-header">
            <div className="logo-icon"></div>
            <h1>Create Account</h1>
            <p>Join the future of intelligence</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Name  */}
            <div className="input-group">
              <label>Full Name</label>
              <div className="flex w-full gap-1">
                <input
                  type="text"
                  className="w-1/2"
                  placeholder="John Doe"
                  {...register("username.firstname", {
                    required: "Name is required",
                  })}
                />
                {errors.username && (
                  <span className="error">
                    {errors.username.firstname.message}
                  </span>
                )}
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-1/2"
                  {...register("username.lastname", {
                    required: "Name is required",
                  })}
                />
                {errors.username && (
                  <span className="error">
                    {errors.username.lastname.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="nexus@example.ai"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Get Started
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>Or use social</span>
          </div>

          <div className="social-login">
            <button className="social-btn">Google</button>
            <button className="social-btn">GitHub</button>
          </div>

          <p className="auth-footer">
            Already a member?{" "}
            <button onClick={() => navigate("/")}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}
