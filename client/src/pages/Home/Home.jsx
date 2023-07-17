import { Link } from "react-router-dom";
import TB2 from '../../assets/Touch-Base_2.svg';
import "../Home/Home.css";
import Button from "../../components/Button/Button";

export default function Home () {
  return (
    <div className="home-container">
      <main className="main-container">
        <section className="hero-section">
          <img src={TB2} alt="logo" />
          <h1>
            Effortlessly connect and stay in touch with
            <span className="h1-gradient"> Touch Base</span>
          </h1>
          <div className="cta-section">
            <Button className="demo-cta">
              <Link>Demo Login</Link>
            </Button>
            <Button className="hero-section-cta">
              <Link to={'/sign-up'}>Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};
