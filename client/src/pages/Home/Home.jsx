import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import TB2 from '../../assets/Touch-Base_2.svg';
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
    <div className="home-container">
      <main className="main-container">
        <section className="hero-section">
          <img src={TB2} alt="logo" />
          <h1>
            Effortlessly connect and stay in touch with
            <span className="h1-gradient"> Touch Base</span>
          </h1>
          <div className="cta-section">
            <Button className="hero-section-cta">
              <Link className="get-started-link" to={'/sign-up'}>Get Started</Link>
            </Button>
            <Button className="demo-cta" onClick={handleDemoLogin}>
              <Link className="demo-link">Demo Login</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};
