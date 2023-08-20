import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuth } from "firebase/auth";
import { ContactsContext } from "../../context/ContactsContext";
import { formatPhoneNumber } from "../../utils/utils";
import { LuPhone, LuMail, LuHome } from "react-icons/lu";
import { ReactComponent as GroupIcon } from "../../assets/Group.svg";
import Navbar from "../../components/Navbar/Navbar";
import Card from "../../components/Card/Card";
import BackButton from "../../components/BackButton/BackButton";
import "./ContactDetails.css";

export default function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();
  const { fetchAContact } = useContext(ContactsContext);
  const { currentUser } = useAuth;
  const auth = getAuth();

  useEffect(() => {
    const fetchContact = async () => {
      if (auth.currentUser) {
        const fetchedContact = await fetchAContact(id);
        setContact(fetchedContact);
      } else {
          console.error("There has been a problem with your request:");
      };
    }
    fetchContact();
    // eslint-disable-next-line
  }, [id, auth, currentUser]);

  if (!contact)
    return (
      <div>Error with request. Are you sure you're in the right place?</div>
    );
  //   "re-routing..."

  return (
    <div>
      <Navbar className="contact-details-header" />
      <div className="contact-details-container">
        <BackButton className="go-back-link" />
        <Card className="contact-details-card">
          <img className="contact-details-image" src={contact.photo_url}
            alt={"portrait of " + contact.first_name + " " + contact.last_name}
          />
          <h1 className="contact-details-name">{contact.first_name} {contact.last_name}</h1>
          <p className="contact-details-phone"><LuPhone />{formatPhoneNumber(contact.phone)}</p>
          <p className="contact-details-email"><LuMail />{contact.email}</p>
          <p className="contact-details-address"><LuHome />{contact.address1} {contact.address2}, {contact.city}, {contact.state}, {contact.zip}</p>
          <p className="contact-details-group"><GroupIcon />{contact.categories}</p>
          <br />
          <p className="contact-details-notes"><span className="notes-field">Notes</span>:{" "} {contact.notes}</p>
        </Card>
      </div>
    </div>
  );
}
