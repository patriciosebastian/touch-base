import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LuMenu } from 'react-icons/lu';
import Dropdown from '../Dropdown/Dropdown';
import useOutsideClick from '../../hooks/useOutsideClick';
import './HamburgerMenu.css';

export default function HamburgerMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { logout } = useAuth();
  const ref = useRef(null);
  const navigate = useNavigate();

  useOutsideClick(ref, () => setMobileNavOpen(false));

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
    <div className="mobile-nav-container" ref={ref}>
      <div>
        <LuMenu className="mobile-nav-menu-icon" onClick={() => setMobileNavOpen(!mobileNavOpen)} />
      </div>
      <Dropdown className={`mobile-nav-ul ${mobileNavOpen ? '' : 'hidden'}`}>
        <li><Link to={'/app'}>Contacts</Link></li>
        <li><Link to={'/app/groups'}>Groups</Link></li>
        <li><Link to={'/app/favorites'}>Favorites</Link></li>
        <li><Link to={'/app/account'}>Account</Link></li>
        <br />
        <li className="nav-dropdown-logout" onClick={handleLogout}>Log out</li>
      </Dropdown>
    </div>
  )
}
