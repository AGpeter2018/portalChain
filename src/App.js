import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { auth, createUserProfile } from "./firebase-utils";

import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Coin from "./pages/coin/coin";
import Footer from "./components/footer/footer";
import SignUp from "./components/sign-up-/sign-up";
import SignIn from "./components/sign-in/sign-in";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const onSubscription = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = await createUserProfile(user);
        userRef.onSnapshot((snapshot) => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => onSubscription();
  }, []);

  return (
    <div className="App">
      <Navbar currentUser={currentUser} />
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/signIn" replace />}
        />
        <Route path="/coin/:coinId/" element={<Coin />} />
        <Route
          path="/signIn"
          element={currentUser ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/signUp"
          element={currentUser ? <Navigate to="/" replace /> : <SignUp />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
