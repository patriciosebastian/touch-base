import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Account/Account.css";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/sign-in");
      console.log("You are logged out");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h1>Account</h1>
      <p>User Email: {user && user.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
