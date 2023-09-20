import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GroupsContext } from '../../context/GroupsContext';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { PiPlusThin } from 'react-icons/pi';
import Card from '../../components/Card/Card';
import useMedia from '../../hooks/useMedia';
import SideNav from '../../components/SideNav/SideNav';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ViewGroups.css';

export default function Groups() {
  const { groups, fetchGroups } = useContext(GroupsContext);
  const { idToken, authLoading, isRestoring } = useAuth();
  const [loading, setLoading] = useState(false);
  const isDesktop = useMedia('(min-width: 1200px)');

  useEffect(() => {
    const fetchGroupData = async () => {
      if (auth.currentUser && idToken && !authLoading) {
        setLoading(true);
        await fetchGroups();
        setLoading(false);
      } else if (!authLoading) {
        console.log("User not signed in");
        setLoading(false);
      }
    }

    fetchGroupData();
  }, [fetchGroups, idToken, authLoading]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (isRestoring) {
    return (
      <>
        <LoadingSpinner />
        <p className="demo-logout-message">Restoring demo data... Thank you for demo'ing the app!</p>
      </>
    )
  }

  return (
    <div>
      <div className="view-groups-container">
        <div className="groups-container">
          <h1 className="groups-h1">Groups</h1>
          {loading ? <LoadingSpinner /> : (
            <div className="display-groups-container">
              {groups && groups.map((group) => (
                <Card key={group.group_id} className="group-card" style={{ backgroundImage: `url(${group.cover_picture})`}}>
                  <Link className="group-details-link" to={'/app/groups/' + group.group_id}>
                    <h2>
                      {group.group_name}
                    </h2>
                    <p>
                      {group.about_text}
                    </p>
                  </Link>
                </Card>
              ))}
              <div className="add-group-icon-container">
                <Link className="add-group-link" to={'/app/groups/create-group'}>
                  <PiPlusThin className='add-group-icon' />
                </Link>
              </div>
            </div>
          )}
        </div>
        {isDesktop && <SideNav className="view-groups-side-nav" />}
      </div>
    </div>
  );
}
