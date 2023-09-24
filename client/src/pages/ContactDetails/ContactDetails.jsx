import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuth } from "firebase/auth";
import { ContactsContext } from "../../context/ContactsContext";
import { GroupsContext } from "../../context/GroupsContext";
import { formatPhoneNumber } from "../../utils/utils";
import { LuPhone, LuMail, LuHome } from "react-icons/lu";
import { ReactComponent as GroupIcon } from "../../assets/Group.svg";
import Card from "../../components/Card/Card";
import BackButton from "../../components/BackButton/BackButton";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./ContactDetails.css";

export default function ContactDetails() {
  const [contact, setContact] = useState(null);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { currentUser } = useAuth;
  const { fetchAContact } = useContext(ContactsContext);
  const { fetchGroups } = useContext(GroupsContext);
  const auth = getAuth();

  useEffect(() => {
    const fetchContactAndGroups = async () => {
      if (auth.currentUser) {
        setLoading(true);
        const fetchedContact = await fetchAContact(id);
        setContact(fetchedContact);

        const groups = await fetchGroups();
        setAllGroups(groups);
        
        setLoading(false);
      } else {
          console.error("There has been a problem with your request:");
          setLoading(false);
      };
    }
    fetchContactAndGroups();
    // eslint-disable-next-line
  }, [id, auth, currentUser, fetchGroups]);

  // filter groups that have the contact,
  // only when contact & all groups are available
  const groupsWithContact =
    contact && allGroups && allGroups.length > 0
      ? allGroups.filter((group) => {
          return (
            group.contacts &&
            group.contacts.some(
              (contactObj) => contactObj.contacts_id === contact.contacts_id
            )
          );
        })
      : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  // Non-existent contact
  if (!contact) {
    setLoading(false);
    return (
      <div>That contact couldn't be found, or there was a different error with the request. Are you sure you're in the right place?</div>
    );
  }

  return (
    <div>
      <div className="contact-details-container">
        <BackButton className="go-back-link" />
        <Card className="contact-details-card">
          <img className="contact-details-image" src={contact.photo_url}
            alt={"portrait of " + contact.first_name + " " + contact.last_name}
          />
          <h1 className="contact-details-name">{contact.first_name} {contact.last_name}</h1>
          <p className="contact-details-phone"><LuPhone />{formatPhoneNumber(contact.phone)}</p>
          <p className="contact-details-email"><LuMail />{contact.email}</p>
          <p className="contact-details-address"><LuHome />{contact.address1}, {contact.address2 ? contact.address2 + "," : ""} {contact.city}, {contact.state}, {contact.zip}</p>
          <p className="contact-details-group"><GroupIcon />{groupsWithContact ? groupsWithContact.map(group => group.group_name).join(', ') : ''}</p>
          <br />
          <p className="contact-details-notes"><span className="notes-field">Notes</span>:{" "} {contact.notes}</p>
        </Card>
      </div>
    </div>
  );
}
