import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import './SideNav.css';

export default function SideNav(props) {
    const classes = 'side-nav ' + props.className;

    // should I take 'log out' out of SideNav?
    const handleLogout = async () => {
        try {
            // await logout();
            // navigate("/sign-in");
            console.log("You are logged out");
        } catch (err) {
            console.log(err.message);
        }
    };

  return (
    <Dropdown className={classes} style={props.style}>
      <li><Link to={'/app'}>Contacts</Link></li>
      <li><Link to={'/app/groups'}>Groups</Link></li>
      <li><Link to={'/app/favorites'}>Favorites</Link></li>
      <li><Link to={'/app/account'}>Account</Link></li>
      <br />
      <li className="nav-dropdown-logout" onClick={handleLogout}>Log out</li>
    </Dropdown>
  )
}
