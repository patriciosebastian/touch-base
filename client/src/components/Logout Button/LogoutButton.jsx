import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './LogoutButton.css';

export default function LogoutButton(props) {
  const { logout, demoLogout, currentUser } = useAuth();
  const navigate = useNavigate();
  const classes = 'logout-btn ' + props.className;
  
  const handleLogout = async () => {
    try {
      if (currentUser.uid === "h8j3g6KvbsSXNBjyEysqAawGbJy2") {
        await demoLogout();
      }
      await logout();
      navigate("/sign-in");
      console.log("You are logged out");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button className={classes} onClick={handleLogout}>Log Out</button>
  )
}
