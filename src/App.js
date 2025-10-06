import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Coin from "./pages/coin/coin";
import Footer from "./components/footer/footer";
import SignUp from "./components/sign-up-/sign-up";
import SignIn from "./components/sign-in/sign-in";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:coinId/" element={<Coin />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
