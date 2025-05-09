import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
import Features from "../../components/Features/Features";
import "./Home.css";

export default function Home () {
  const { demoLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      await demoLogin();
      navigate('/sign-in');
    } catch (err) {
      console.error("Error logging in as demo user:", err);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="hero-container">
          <img src={logo} alt="logo: user group, contact card, and email icons" />
          <h1>
            Effortlessly manage your <br />
            contacts with <span className="h1-gradient">Touch Base</span>
          </h1>
          <p className="hero-subheading">
            The most straightforward way to organize, store, and manage your personal contacts. Free.
          </p>
          <div className="cta-container">
            <Button className="main-cta">
              <Link className="main-cta-link" to={'/sign-up'}>Get Started</Link>
            </Button>
            <Button className="demo-cta" onClick={handleDemoLogin}>
              <Link className="demo-link">Demo Login</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="home-container__below-the-fold">
        <div className="wave-divider">
          <svg className="wave" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L48 8.875C96 17.75 192 35.5 288 53.25C384 71 480 88.75 576 80.5C672 71 768 35.5 864 26.625C960 17.75 1056 35.5 1152 53.25C1248 71 1344 88.75 1392 97.625L1440 106.5V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="currentColor" />
          </svg>
        </div>
        <div className="features-section">
          <Features />
        </div>
        <section className="footer-cta">
          <div className="footer-cta-container">
            <h2 className="footer-cta-heading">
              Ready to streamline your contact management?
            </h2>
            <Link to={'/sign-up'}>
              <button className="footer-cta-button">
                Get Started Free
              </button>
            </Link>
          </div>
        </section>
        <footer className="main-footer">
          <div className="footer-container">
            <p className="footer-logo gradient-text">
              TouchBase
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
