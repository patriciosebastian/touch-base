import { useEffect, useContext } from "react";
import { ContactsContext } from "../../context/ContactsContext";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { LuEye } from 'react-icons/lu';
import { LuEdit3 } from 'react-icons/lu';
import DeleteContact from "../DeleteContact/DeleteContact";
import Header from "../../components/Header/Header";
import MoreOptions from "../../components/MoreOptions/MoreOptions";
import "../ViewContacts/ViewContacts.css";

const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null;
} // can I move this inside of ViewContacts()?

export default function ViewContacts() {
  const { contacts, fetchContacts } = useContext(ContactsContext);
  const { idToken, authLoading } = useAuth();

  // fetch contacts on component mount
  useEffect(() => {
    if (auth.currentUser && idToken && !authLoading) {
      fetchContacts();
    } else if (!authLoading) {
      console.log("User not signed in");
    }
  }, [fetchContacts, idToken, authLoading]);
  // fetchContacts will only run once, because
  //  it has no depencies in ContactsContext

  return (
    <div>
      <div className="view-contacts-container">
        <div className="view-contacts-header">
          <Header />
          <div className="search-control">
            {/* move search control out of header. place below a new h2 'Contacts'. Reconsider position of add contact icon */}
            <input className="contact-search" type="search" name="contact-search" id="contact-search" placeholder="search" />
          </div>
        </div>
        <div className="contacts-container">
          {contacts.map((contact) => (
            <div key={contact.contacts_id} className="contact-container">
              <div className="contact-card-control-left">
                <h1>
                  {contact.first_name} {contact.last_name}
                </h1>
                <p>
                  {formatPhoneNumber(contact.phone)}
                </p>
                <p>
                  {contact.email}
                </p>
              </div>
              <div className="contact-card-control-right">
                <MoreOptions className="vc-more-options">
                  <Link to={"/app/contacts/" + contact.contacts_id}><LuEye className="view-contact-icon" /></Link>
                  <Link to={"/app/edit-contact/" + contact.contacts_id}><LuEdit3 className="edit-contact-icon" /></Link>
                  
                  <span><DeleteContact className="delete-contact-icon" id={contact.contacts_id} /></span>
                </MoreOptions>
                <img
                  src={contact.photo_url}
                  alt={
                    "portrait of " + contact.first_name + " " + contact.last_name
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
