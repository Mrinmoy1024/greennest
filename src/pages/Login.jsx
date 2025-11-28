import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../components/AuthProvider";

const Login = () => {
  const { googleLogInFunction, setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await googleLogInFunction();
      setUser(res.user);
      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold">Login now!</h1>
          <p className="py-6">
            Please log in with your Google account for a better experience on
            our page.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-6">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="btn btn-outline flex items-center justify-center gap-2 w-full"
          >
            <FcGoogle /> Continue with Google
          </button>

          <p className="mt-5 flex justify-center gap-1">
            Don't have an account?
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
