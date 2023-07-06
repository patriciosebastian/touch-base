import { useEffect, useContext } from "react";
import { ContactsContext } from "../Context/ContactsContext";
import { Link } from "react-router-dom";
import DeleteContact from "../DeleteContact/DeleteContact";
import "../ViewContacts/ViewContacts.css";
import { auth } from "../../firebase";

export default function ViewContacts() {
  const {contacts, fetchContacts} = useContext(ContactsContext);

  // fetch contacts on component mount
  useEffect(() => {
    if (auth.currentUser) {
      fetchContacts();
    } else {
      console.log('User not signed in');
    }
  }, [fetchContacts]);
  // fetchContacts will only run once, because
  //  it has no depencies in ContactsContext

  return (
    <div>
      <div className="view_contacts-container">
        <h1>Contacts</h1>
        <div className="contacts-container">
          {contacts.map(contact => (
            <div key={contact.contacts_id}>
              <img src={contact.photo_url} alt={"portrait of " + contact.first_name + " " + contact.last_name}/>
              <h1>{contact.first_name} {contact.last_name}</h1>
              <p><strong>Phone: </strong>{contact.phone}</p>
              <p><strong>Email: </strong>{contact.email}</p>
              <p>
                <strong>Address:</strong><br />
                {contact.address1} {contact.address2}, {contact.city}, {contact.state}, {contact.zip}
              </p>
              <p><strong>Categories: </strong>{contact.categories}</p>
              <p><strong>Notes: </strong>{contact.notes}</p>
              <Link to={'/contacts/' + contact.contacts_id}>View Details</Link>
              <Link to={'/edit-contact/' + contact.contacts_id}>Edit Contact</Link>
              <DeleteContact id={contact.contacts_id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
