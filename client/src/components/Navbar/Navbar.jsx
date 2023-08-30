import { Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';
import useMedia from '../../hooks/useMedia';
import './Navbar.css';

export default function Navbar(props) {
  const isMobile = useMedia('(max-width: 1199px)');
  const classes = 'navbar ' + props.className;

  return (
    <>
      <div className={classes}>
        <h1 className='navbar-brand'>TB</h1>
        {isMobile ? <Nav /> : ''}
      </div>
      <Outlet />
    </>
  )
}