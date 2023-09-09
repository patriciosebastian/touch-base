import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import useMedia from "../../hooks/useMedia";
import SideNav from "../../components/SideNav/SideNav";
import "./Account.css";

export default function Account() {
  const { currentUser } = useAuth();
  const isDesktop = useMedia('(min-width: 1200px)');

  return (
    <div>
      {isDesktop && <SideNav className="account-side-nav" />}
      <h1 className="account-main-heading">Account</h1>
      <div className="user-account-info">
        <p><strong>Email: </strong>{currentUser && currentUser.email}</p>
        <LogoutButton className="account-page-logout-btn" />
      </div>
    </div>
  );
}
