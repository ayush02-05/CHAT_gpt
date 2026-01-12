import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (!data) return;
    try {
      const response = await axios.post(
        "https://chat-gpt-a3cn.onrender.com/user/login",
        data,
        { withCredentials: true }
      );
      if (response.status == 200) {
        toast.success("User Logged in Successfully");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
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
            <h1>Welcome Back</h1>
            <p>Access the ThinkAI neural engine</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* EMail */}
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="nexus@example.ai"
                {...register("email", { required: "Email is required" })}
              />
            </div>

            {/* Password */}
            <div className="input-group ">
              <div className="label-row flex justify-between">
                <label>Password</label>
                <a className="text-sm text-purple-600" href="#">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
            </div>

            <button type="submit" className="submit-btn">
              Log In
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn">Google</button>
            <button className="social-btn">GitHub</button>
          </div>

          <p className="auth-footer">
            New to <i>ThinkAI</i> ?{" "}
            <button onClick={() => navigate("/signup")}>Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}
