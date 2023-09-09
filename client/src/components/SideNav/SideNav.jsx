import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { LuContact, LuLogOut } from 'react-icons/lu';
import { LiaUsersSolid } from 'react-icons/lia';
import { MdOutlineAccountCircle } from 'react-icons/md';
import Dropdown from '../Dropdown/Dropdown';
import './SideNav.css';

export default function SideNav(props) {
    const { logout } = useAuth();
    const classes = 'side-nav ' + props.className;

    const handleLogout = async () => {
        try {
            await logout();
            console.log("You are logged out");
        } catch (err) {
            console.log(err.message);
        }
    };

  return (
    <Dropdown className={classes} style={props.style}>
      <li><Link to={'/app'}><LuContact/> Contacts</Link></li>
      <li><Link to={'/app/groups'}><LiaUsersSolid/> Groups</Link></li>
      {/* <li><Link to={'/app/favorites'}>Favorites</Link></li> */}
      <li><Link to={'/app/account'}><MdOutlineAccountCircle/> Account</Link></li>
      <br />
      <li className="nav-dropdown-logout" onClick={handleLogout}><LuLogOut/> Log out</li>
    </Dropdown>
  )
}
