import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../ContactDetails/ContactDetails.css";

export default function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5300/contacts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setContact(data);
        if (data) {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your request:",
          error
        );
      });

    // eslint-disable-next-line
  }, [id]);

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
        <p><strong>Description: </strong>{contact.description}</p>
      </div>
    </div>
  );
}
