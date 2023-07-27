import { Link, useLocation, useParams } from 'react-router-dom';
import { LuPlus } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import './Header.css';

export default function Header(props) {
    const location = useLocation();
    const path = location.pathname;
    const [addContactIconBlock, setAddContactIconBlock] = useState(true);
    const [pageTitle, setPageTitle] = useState();
    const { id } = useParams();
    const classes = 'header-container ' + props.className;


    useEffect(() => {
      function setTitle() {
        if (path === '/app') {
            setPageTitle('Contacts');
            return;
        }
        if (path === '/app/create-contact') {
            setPageTitle('Create Contact');
            return;
        }
        if (path === '/app/edit-contact') {
            setPageTitle('Edit Contact');
            return;
        }
        if (path === `/app/contacts/${id}`) {
            setPageTitle('Contact Details');
            return;
        }
        if (path === '/app/account') {
            setPageTitle('Account');
            return;
        }
        if (path === '/app/groups') {
            setPageTitle('Groups');
            return;
        }
        if (path === '/app/favorites') {
            setPageTitle('Favorites');
            return;
        }
      }
      setTitle();
    }, [path, id]);

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
          <h1>{pageTitle}</h1>
          <div className="header-controls">
            {addContactIconBlock && <Link to={'create-contact'}><LuPlus /></Link>}
            <Nav className={addContactIconBlock ? '' : 'flex-end'} />
          </div>
        </div>
    )
}