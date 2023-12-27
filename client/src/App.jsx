import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, SignIn, SignUp, About, Profile, Header } from "./imports";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <div className="bg-gray-50 h-screen">
      <BrowserRouter className="">
        <Header />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/about" element={<About />} />
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
