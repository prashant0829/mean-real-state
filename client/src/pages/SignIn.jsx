import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInvalidInput = (message) => {
    dispatch(signInFailure(message));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    if (!isEmailValid(formData.email)) {
      handleInvalidInput("Invalid email address");
      return;
    }

    if (!isPasswordValid(formData.password)) {
      handleInvalidInput(
        "Password must be at least 8 characters long, have atleat one uppercase, one lowewrcase and a special character"
      );
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/home");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="py-2 flex items-center justify-center">
      <div className="bg-blur-lg bg-white bg-opacity-30 p-10 rounded-md max-w-md w-full">
        <h1 className="text-3xl text-center font-semibold mb-6">Sign In</h1>
        <form>
          <div className="mb-4">
            <div className="flex flex-col relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-gray-500 w-full text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mb-4"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth isSignUpPage={false} />
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
        {error && (
          <p className="text-sm text-center text-red-500 mt-5">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Signin;
