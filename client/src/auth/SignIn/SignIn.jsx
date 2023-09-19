import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { FcGoogle } from 'react-icons/fc';
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "../SignIn/SignIn.css";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { signInWithGoogle } = useAuth();
    const { demoEmail, demoPassword, isDemo, setIsDemo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (isDemo) {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setIsDemo(false);
      } else {
        setEmail('');
        setPassword('');
        setIsDemo(false);
      }
      // eslint-disable-next-line
    }, [demoEmail, demoPassword]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      // prevent multiple form submits
      setLoading(true);
      setError('');
      try {
          await login(email, password);
          setLoading(false);
          navigate('/app');
      } catch (err) {
          setError(err.message);
          console.error(err.message);
          setLoading(false);
      }
      // return button to default state
      setLoading(false);
    };

  return (
    <div className="si-page-container">
      {loading ? <LoadingSpinner /> : (
        <Card className="sign-in-card">
          <h1 className="sign-in-h1">Welcome Back!</h1>
          {error && <p>{error}</p>}
          <form className="sign-in-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="sign-in-buttons-container">
              <Button className="sign-in-button" type="submit" disabled={loading}>Sign In</Button>
              {/* Sign in with Google button has to be used with native button element */}
              <button className="google-sign-in-button" type="button" onClick={(e) => {e.preventDefault(); signInWithGoogle(() => navigate('/app'));}}><FcGoogle/> Sign In with Google</button>
            </div>
            <p className="sign-in-form-p">Or sign up <Link to={'/sign-up'} className="sign-up-link">here</Link>.</p>
          </form>
        </Card>
      )}
    </div>
  );
}
