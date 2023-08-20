import { Link, Outlet, useLocation } from "react-router-dom";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import "./Nav.css";

export default function Nav(props) {
  const location = useLocation();
  const path = location.pathname;
  const classes = 'nav-items ' + props.className;

  return (
    <>
      <nav className={classes}>
        {path === '/' && <ul className="home-ul"><li><Link to={'/sign-in'}>Sign In</Link></li></ul>}
        {(path === '/sign-in' || path === '/sign-up') && <ul className="auth-ul"><li><Link to={'/'}>Navbar Logo</Link></li></ul>}
        {(path !== '/sign-in' && path !== '/sign-up' && path !== '/') && <HamburgerMenu /> }
      </nav>
      <Outlet />
    </>
  );
}
