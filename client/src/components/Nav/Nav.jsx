import { Link, useLocation } from "react-router-dom";
import "../Nav/Nav.css";

export default function Nav(props) {
  const location = useLocation();
  const path = location.pathname;
  const classes = 'nav-bar ' + props.className;

  return (
    <nav className={classes}>
      <ul>
        {path === '/' && <li><Link to={'/sign-in'}>Sign In</Link></li>}
        {(path === '/sign-in' || path === '/sign-up') && <li><Link to={'/'}>Navbar Logo</Link></li>}
        {(path !== '/sign-in' && path !== '/sign-up' && path !== '/') &&
          <>
            <li><Link to={'/'}>Navbar Logo</Link></li>
            <li><Link to={'/app/account'}>Dashboard</Link></li>
            <li><Link to={'/app'}>Menu</Link></li>
          </>
        }
      </ul>
    </nav>
  );
}
