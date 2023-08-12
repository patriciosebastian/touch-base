import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import "../SignUp/SignUp.css";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // prevent multiple form submits
        setLoading(true);
        setError('');
        try {
            await signup(email, password);
            navigate('/sign-in');
        } catch (err) {
            setError(err.message);
            console.error(err.message);
            setLoading(false);
        }
        // return button to default state
        setLoading(false);
    }

  return (
    <div className="su-page-container">
      <Card className="sign-up-card">
        <h1 className="sign-up-h1">Create Account</h1>
        {error && <p>{error}</p>}
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="sign-up-button" type="submit" disabled={loading}>Sign Up</Button>
          <p className="sign-up-form-p">Or sign in <Link to={'/sign-in'} className="sign-in-link">here</Link>.</p>
        </form>
      </Card>
    </div>
  );
}
