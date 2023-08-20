import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Navbar/Navbar";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import "./Account.css";

export default function Account() {
  const { currentUser } = useAuth();

  return (
    <div>
      <Header className="account-header" />
      <h1 className="account-main-heading">Account</h1>
      <div className="user-account-info">
        <p><strong>Email: </strong>{currentUser && currentUser.email}</p>
        <LogoutButton className="account-page-logout-btn" />
      </div>
    </div>
  );
}
