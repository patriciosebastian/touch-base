import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import Nav from '../Nav/Nav';
import './Header.css';

export default function Header(props) {
  const [addContactIconBlock, setAddContactIconBlock] = useState(true);
  const location = useLocation();
  const path = location.pathname;
  const classes = 'header-container ' + props.className;

  useEffect(() => {
      function showOrHideIcon() {
        if (path !== '/app') {
          setAddContactIconBlock(false);
        }
      };
      showOrHideIcon();
  }, [path]);

  return (
    <div className={classes}>
      <h1 className='navbar-brand'>TB</h1>
      <div className="header-controls">
        {addContactIconBlock && <Link to={'create-contact'}><LuPlus /></Link>}
        <Nav className={addContactIconBlock ? '' : 'flex-end'} />
      </div>
    </div>
  )
}