import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
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
      <div className="hero-container">
        <img src={logo} alt="logo: user group, contact card, and email icons" />
        <h1>
          Effortlessly manage your <br />
          contacts with <span className="h1-gradient">Touch Base</span>
        </h1>
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
  );
};
