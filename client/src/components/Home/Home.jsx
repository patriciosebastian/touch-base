import { Link } from "react-router-dom";
import Touch_Base_Temp from "../../assets/Touch_Base_Temp.png";
import "../Home/Home.css";

export default function Home () {
  return (
    <div className="home-container">
      <main className="main-container">
        <section className="hero-section">
          <img src={Touch_Base_Temp} alt="logo" />
          <h1>
            Effortlessly connect and stay in touch with{" "}
            <span className="h1-gradient">Touch Base</span>
          </h1>
          <Link className="hero-section-cta" to={'/sign-up'}>Get Started</Link>
        </section>
      </main>
    </div>
  );
};
