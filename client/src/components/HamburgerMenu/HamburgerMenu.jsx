import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LuMenu } from 'react-icons/lu';
import Dropdown from '../Dropdown/Dropdown';
import useOutsideClick from '../../hooks/useOutsideClick';
import './HamburgerMenu.css';

export default function HamburgerMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { logout, demoLogout, currentUser } = useAuth();
  const ref = useRef(null);

  useOutsideClick(ref, () => setMobileNavOpen(false));

  const handleClick = () => {
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (currentUser.uid === "h8j3g6KvbsSXNBjyEysqAawGbJy2") {
        await demoLogout();
      }
      await logout();
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
        <li><Link to={'/app'} onClick={() => handleClick()}>Contacts</Link></li>
        <li><Link to={'/app/groups'} onClick={() => handleClick()}>Groups</Link></li>
        {/* <li><Link to={'/app/favorites'} onClick={() => handleClick()}>Favorites</Link></li> */}
        <li><Link to={'/app/account'} onClick={() => handleClick()}>Account</Link></li>
        <br />
        <li className="nav-dropdown-logout" onClick={handleLogout}>Log out</li>
      </Dropdown>
    </div>
  )
}
