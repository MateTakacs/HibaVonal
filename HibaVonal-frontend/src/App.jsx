import { useState, useEffect } from "react"; // Hozzáadva: useEffect
import axios from "axios"; // Hozzáadva: axios
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // --- TESZT KÓD ELEJE ---
  useEffect(() => {
    // A portot a te képed alapján írtam be (7254)
    // A /weatherforecast az alapértelmezett .NET API végpont
    axios
      .get("https://localhost:7218/weatherforecast")
      .then((response) => {
        console.log(
          "SIKER! Megérkeztek az adatok a C# backendből:",
          response.data,
        );
      })
      .catch((error) => {
        console.error("HIBA! Valami nem stimmel a kapcsolattal:", error);
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
