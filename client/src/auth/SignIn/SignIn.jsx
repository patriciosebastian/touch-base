import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../SignIn/SignIn.css";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // prevent multiple form submits
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/account');
        } catch (err) {
            setError(err.message);
            console.error(err.message);
            setLoading(false);
        }
        // return button to default state
        setLoading(false);
    }

  return (
    <div>
      <div className="sign-in-container">
        <h1>Welcome!</h1>
        {error && <p>{error}</p>}
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>Sign In</button>
          <button type="button" onClick={(e) => {e.preventDefault(); signInWithGoogle(() => navigate('/account'));}}>Sign In with Google</button>
          <p>Or sign up <Link to={'/sign-up'}>here.</Link></p>
        </form>
      </div>
    </div>
  );
}
