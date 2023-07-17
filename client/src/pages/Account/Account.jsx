import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Account/Account.css";

export default function Account() {
  const { currentUser, logout } = useAuth();
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
      <p><strong>User Email: </strong>{currentUser && currentUser.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
