import { Link, useLocation, Outlet } from 'react-router-dom';
import './PublicNav.css';

export default function PublicNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <nav className="public-nav">
        {path === '/' && <ul className="home-ul"><li><Link className="sign-in-link" to={'/sign-in'}>Sign In</Link></li></ul>}
        {(path === '/sign-in' || path === '/sign-up') && <ul className="auth-ul"><li><Link className="auth-navbar-brand" to={'/'}>TB</Link></li></ul>}
      </nav>
      <Outlet />
    </>
  )
}
