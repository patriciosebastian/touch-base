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
          <button className="hero-section-cta">Get Started</button>
        </section>
      </main>
    </div>
  );
};
