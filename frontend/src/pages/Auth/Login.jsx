import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn, Clapperboard } from "lucide-react";
import { toast } from "react-toastify";

import Loader from "../../component/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/users";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));

      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f1014] text-white">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop)",
        }}
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-[#0f1014]/80" />

      {/* Purple glow */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">

        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30">
              <Clapperboard size={22} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              CineVerse
            </span>
          </Link>

          {/* Login Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#15161b]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to continue your cinematic journey.
              </p>
            </div>

            <form onSubmit={submitHandler}>

              {/* Email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border border-white/[0.08]
                      bg-[#0f1014]
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-gray-600
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="password"
                    id="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border border-white/[0.08]
                      bg-[#0f1014]
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-gray-600
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                  />
                </div>
              </div>

              {/* Button */}
              <button
                disabled={isLoading}
                type="submit"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-indigo-600
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-purple-900/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:from-purple-500
                  hover:to-indigo-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <LogIn size={17} />
                    Sign In
                  </>
                )}
              </button>

              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}
            </form>

            {/* Register */}
            <div className="mt-7 border-t border-white/[0.06] pt-6 text-center">
              <p className="text-sm text-gray-500">
                New to CineVerse?{" "}
                <Link
                  to={
                    redirect
                      ? `/register?redirect=${redirect}`
                      : "/register"
                  }
                  className="font-semibold text-purple-400 transition hover:text-purple-300"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Your gateway to a world of movies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;