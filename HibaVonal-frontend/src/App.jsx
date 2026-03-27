import { useState, useEffect } from "react"; // Hozzáadva: useEffect
import axios from "axios"; // Hozzáadva: axios
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import api from "./Api/axiosConfig"; // Hozzáadva: az axiosConfig importálása
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // --- TESZT KÓD ELEJE ---
  useEffect(() => {
    // az axiosConfig-ban már megvan a végpont https://localhost... része.
    api
      .get("/weatherforecast")
      .then((response) => {
        console.log(
          "SZUPER! Az axiosConfig-on keresztül is jön az adat:",
          response.data,
        );
      })
      .catch((error) => {
        console.error(
          "Hoppá! Valami baj van az axiosConfig beállításával:",
          error,
        );
      });
  }, []);
  // --- TESZT KÓD VÉGE ---

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Backend teszt folyamatban... F12</h1>
        </div>
      </section>
    </>
  );
}

export default App;
