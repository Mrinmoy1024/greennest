import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../components/AuthProvider";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const SignUp = () => {
  const { googleLogInFunction, setLoading, setUser, updateProfileFunction } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;
    if (!hasUppercase)
      return "Password must have at least one uppercase letter.";
    if (!hasLowercase)
      return "Password must have at least one lowercase letter.";
    if (!hasMinLength) return "Password must be at least 6 characters long.";
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const error = validatePassword(formData.password);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (updateProfileFunction) {
        await updateProfileFunction({
          displayName: formData.name,
          photoURL: formData.photo,
        });
      }
      toast.success("Sign Up successful!");
    } catch (err) {
      toast.error(err.message || "Profile update failed");
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    if (typeof setLoading === "function") setLoading(true);

    try {
      if (!googleLogInFunction)
        throw new Error("Google login function not available");
      const res = await googleLogInFunction();

      if (res?.user && typeof setUser === "function") setUser(res.user);

      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen flex items-center justify-center">
      <div className="hero-content flex-col">
        <h1 className="text-5xl font-bold text-center mb-6">Sign Up</h1>

        <div className="card bg-base-100 w-[600px] shadow-2xl">
          <div className="card-body">
            <form className="fieldset space-y-3" onSubmit={handleSignUp}>
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input w-[500px]"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label className="label">Photo</label>
              <input
                type="text"
                name="photo"
                className="input w-[500px]"
                placeholder="Photo URL"
                value={formData.photo}
                onChange={handleChange}
                required
              />

              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input w-[500px]"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="label">Password</label>
              <div className="relative w-[500px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input w-full pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" className="btn btn-neutral mt-4 w-[500px]">
                Sign Up
              </button>

              <p className="text-center text-xl mt-3">or</p>

              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="btn btn-outline mt-2 flex items-center justify-center gap-2 w-[500px]"
              >
                <FcGoogle /> Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
