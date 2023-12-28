// Signup.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isEmailValid(formData.email)) {
      alert("Invalid email address");
      setLoading(false);
      return;
    }

    if (!isPasswordValid(formData.password)) {
      alert("Password must be at least  characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        setErrorMessage(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setErrorMessage("");
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      setLoading(false);
      setErrorMessage(error);
    }
  };

  return (
    <div className="py-2 flex items-center justify-center">
      <div className="bg-blur-lg bg-white bg-opacity-30 p-10 rounded-md max-w-md w-full">
        <h1 className="text-3xl text-center font-semibold mb-6">Signup</h1>
        <form>
          <div className="mb-4">
            <div className="flex flex-col">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth isSignUpPage={true} setSignUpErrorMessage={setErrorMessage} />
        </form>
        {/* Already have an account section */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
        {errorMessage && (
          <p className="text-sm text-center text-red-500 mt-5">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
