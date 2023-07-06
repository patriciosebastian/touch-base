import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../ContactDetails/ContactDetails.css";
import { getAuth } from "firebase/auth";

export default function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();
  const { currentUser } = useAuth;
  const auth = getAuth();

  useEffect(() => {
    const fetchContact = async () => {
      let idToken = '';
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      fetch(`http://localhost:5300/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setContact(data);
          if (data) {
            currentUser ? console.log(data) : console.log(null);
          }
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your request:",
            error
          );
        });

    };

    fetchContact();
    // eslint-disable-next-line
  }, [id, auth, currentUser]);

  if (!contact) return <div>Error with request. Are you sure you're in the right place?</div>;
  //   "re-routing..."

  return (
    <div>
      <div>
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
      </div>
    </div>
  );
}
