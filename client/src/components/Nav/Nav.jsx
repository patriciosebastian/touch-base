import { Link, Outlet, useLocation } from "react-router-dom";
import { LuMenu } from 'react-icons/lu';
import { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import LogoutButton from "../Logout Button/LogoutButton";
import "../Nav/Nav.css";

export default function Nav(props) {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const path = location.pathname;
  const classes = 'nav-bar ' + props.className;

  const MobileNav = () => {
    return (
        <div className="mobile-nav-container">
          <div>
            <LuMenu className="mobile-nav-menu-icon" onClick={() => setMobileNavOpen(!mobileNavOpen)} />
          </div>
          {/* <ul className={`mobile-nav-ul ${mobileNavOpen ? '' : 'hidden'}`}>
            <li><Link to={'/app'}>Contacts</Link></li>
            <li><Link to={'/app/groups'}>Groups</Link></li>
            <li><Link to={'/app/favorites'}>Favorites</Link></li>
            <li><Link to={'/app/account'}>Account</Link></li>
            <br />
            <button>Log Out</button>
          </ul> */}
          <Dropdown className={`mobile-nav-ul ${mobileNavOpen ? '' : 'hidden'}`}>
            <li><Link to={'/app'}>Contacts</Link></li>
            <li><Link to={'/app/groups'}>Groups</Link></li>
            <li><Link to={'/app/favorites'}>Favorites</Link></li>
            <li><Link to={'/app/account'}>Account</Link></li>
            <br />
            <LogoutButton />
          </Dropdown>
        </div>
    );
  }

  return (
    <>
      <nav className={classes}>
        {path === '/' && <ul className="home-ul"><li><Link to={'/sign-in'}>Sign In</Link></li></ul>}
        {(path === '/sign-in' || path === '/sign-up') && <ul className="auth-ul"><li><Link to={'/'}>Navbar Logo</Link></li></ul>}
        {(path !== '/sign-in' && path !== '/sign-up' && path !== '/') && <MobileNav /> }
      </nav>
      <Outlet />
    </>
  );
}
