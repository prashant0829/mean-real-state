import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, SignIn, SignUp, About, Profile, Header } from "./imports";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

const App = () => {
  return (
    <div className="bg-gray-50 h-screen">
      <BrowserRouter className="">
        <Header />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
