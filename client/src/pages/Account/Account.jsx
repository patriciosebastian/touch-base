import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import "../Account/Account.css";
import LogoutButton from "../../components/Logout Button/LogoutButton";

export default function Account() {
  const { currentUser } = useAuth();

  return (
    <div>
      <Header className="account-header" />
      <div className="user-account-info">
        <p><strong>Email: </strong>{currentUser && currentUser.email}</p>
        <LogoutButton className="account-page-logout-btn" />
      </div>
    </div>
  );
}
