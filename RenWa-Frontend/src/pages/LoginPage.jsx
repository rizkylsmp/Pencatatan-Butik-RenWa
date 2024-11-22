import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import logo from "../assets/LOGO.jpeg";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log("Login success:", isSuccess, "User:", user);
    if (user && isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <section>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-nunito">
        <div className="absolute md:top-10 md:left-10 top-3 flex md:flex-col gap-5 md:p-5 p-2 rounded-xl border border-black md:text-md text-sm">
          <div>
            <div className="font-bold">LOGIN ADMIN</div>
            <div>Username : admin</div>
            <div>Password : admin</div>
          </div>
          <div>
            <div className="font-bold">LOGIN KARYAWAN</div>
            <div>Username : karyawan</div>
            <div>Password : karyawan</div>
          </div>
        </div>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img className="mx-auto h-24" src={logo} alt="Butik Renwa Logo" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Butik RenWa (Demo)
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={Auth}>
            {isError && (
              <p className="has-text-centered text-red-500">{message}!</p>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#a259cc] focus:border-color-2 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#a259cc] focus:border-color-2 focus:z-10 sm:text-sm"
                  placeholder="******"
                />
                <div className="flex items-center mt-2">
                  <input
                    id="show-password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="show-password"
                    className="text-sm text-color-5"
                  >
                    Show Password
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button
                disabled={!username || !password || isLoading}
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-color-2 ring-color-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !username || !password || isLoading
                    ? "disabled:opacity-50"
                    : ""
                }`}
              >
                {isLoading ? "Loading..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
