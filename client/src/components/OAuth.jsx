import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = ({ isSignUpPage, setSignUpErrorMessage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleOAuth = async (e) => {
    console.log(import.meta.env);
    try {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/home");

      console.log(result);
    } catch (error) {
      isSignUpPage && setSignUpErrorMessage(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <button
      type="submit"
      onClick={handleGoogleOAuth}
      className="bg-red-500 w-full text-white py-2 px-4 rounded-md hover:opacity-95 disabled:opacity-80 transition duration-300"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
