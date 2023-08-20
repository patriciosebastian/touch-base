import Nav from '../Nav/Nav';
import './Navbar.css';

export default function Navbar(props) {
  const classes = 'navbar ' + props.className;

  return (
    <div className={classes}>
      <h1 className='navbar-brand'>TB</h1>
      <Nav />
    </div>
  )
}