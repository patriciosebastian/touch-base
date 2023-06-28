import { useEffect, useContext } from "react";
import { ContactsContext } from "../Context/ContactsContext";
import "../ViewContacts/ViewContacts.css";

export default function ViewContacts() {
  const {contacts, fetchContacts} = useContext(ContactsContext);

  // fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //render contacts (contacts = all contacts including if any were created)
  console.log(contacts);

  return (
    <div>
      <div className="view_contacts-container">
        <h1>View Contacts</h1>
        <div className="contacts-container">
          <ul>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
