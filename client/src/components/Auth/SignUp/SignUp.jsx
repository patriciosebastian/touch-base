import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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
    <div>
      <div className="sign-up-container">
        <h1>Create Account</h1>
        {error && <p>{error}</p>}
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>Sign Up</button>
          <p>Or sign in <Link to={'/sign-in'}>here.</Link></p>
        </form>
      </div>
    </div>
  );
}
