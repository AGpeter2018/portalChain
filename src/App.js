import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { auth } from "./firebase-utils";

import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Coin from "./pages/coin/coin";
import Footer from "./components/footer/footer";
import SignUp from "./components/sign-up-/sign-up";
import SignIn from "./components/sign-in/sign-in";
import { createUserProfile } from "./firebase-utils";

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const subscription = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = await createUserProfile(user);
      userRef.onSnapshot((snapshot) => {
        setCurrentUser(
          currentUser({
            id: snapshot.id,
            ...snapshot.data(),
          })
        );
      });
    }
  });
  useEffect(() => {
    // if (subscription) {
    //   return subscription();
    // }
    subscription();
  }, [subscription]);

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
