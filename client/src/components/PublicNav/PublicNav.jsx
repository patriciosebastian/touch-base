import { Link, useLocation, Outlet } from 'react-router-dom';
import './PublicNav.css';

export default function PublicNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <nav className="public-nav">
        <ul className="auth-ul">
          <li>
            <Link className="auth-navbar-brand" to={'/'}>TouchBase</Link>
          </li>
          {path === '/' && <li>
              <Link className="sign-in-link" to={'/sign-in'}>Sign In</Link>
            </li>
          }
        </ul>
      </nav>
      <Outlet />
    </>
  )
}
