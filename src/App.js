import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Coin from "./pages/coin/coin";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin:coinId" element={<Coin />} />
      </Routes>
    </div>
  );
}

export default App;
