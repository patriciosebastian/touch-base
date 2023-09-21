import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ContactsContext } from "../../context/ContactsContext";
import { getAuth } from "firebase/auth";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./EditContact.css";

export default function EditContact() {
  const { id } = useParams();
  const { updateContact, setToastAlert } = useContext(ContactsContext);
  const { backendURL } = useAuth();
  const [contact, setContact] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      let idToken = "";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const response = await fetch(`${backendURL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      setContact(data);
      setPhotoFile(data.photoFile);
      if (response.ok) {
        auth.currentUser ? console.log(data) : console.log(null);
      } else {
        console.error("Error:", response);
        // display message and re-route user.
      }
    };

    fetchContact();
  }, [id, auth.currentUser]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(contact).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (photoFile) {
      data.append("photo", photoFile);
    }

    try {
      await updateContact(contact.contacts_id, data);
      navigate(-1);
      setLoading(false);
      setToastAlert({
        visible: true,
        message: 'Contact updated successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
      setToastAlert({
        visible: true,
        message: 'Failed to update contact!',
        type: 'error'
      });
    }
  };

  return (
    <div>
      <h1 className="edit-contact-heading">Edit Contact</h1>
      {loading ? <LoadingSpinner /> : (
        <form
          className="edit-contact-form"
          id="edit-contact-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <label htmlFor="first_name">First Name</label>
          <input
            className="edit-contact-first-name"
            type="text"
            id="first_name"
            name="first_name"
            value={contact.first_name || ""}
            onChange={handleChange}
            required
          />
  
          <label htmlFor="last_name">Last Name</label>
          <input
            className="edit-contact-last-name"
            type="text"
            id="last_name"
            name="last_name"
            value={contact.last_name || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="email">Email</label>
          <input
            className="edit-contact-email"
            type="email"
            id="email"
            name="email"
            value={contact.email || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="phone">Phone</label>
          <input
            className="edit-contact-phone"
            type="tel"
            id="phone"
            name="phone"
            value={contact.phone || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="address1">Address 1</label>
          <input
            className="edit-contact-address1"
            type="text"
            id="address1"
            name="address1"
            value={contact.address1 || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="address2">Address 2</label>
          <input
            className="edit-contact-address2"
            type="text"
            id="address2"
            name="address2"
            value={contact.address2 || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="city">City</label>
          <input
            className="edit-contact-city"
            type="text"
            id="city"
            name="city"
            value={contact.city || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="state">State</label>
          <input
            className="edit-contact-state"
            type="text"
            id="state"
            name="state"
            value={contact.state || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="zip">Zip</label>
          <input
            className="edit-contact-zip"
            type="number"
            id="zip"
            name="zip"
            value={contact.zip || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="notes">Notes</label>
          <input
            className="edit-contact-notes"
            type="text"
            id="notes"
            name="notes"
            value={contact.notes || ""}
            onChange={handleChange}
          />
  
          <label htmlFor="photo">Select a photo:</label>
          <input
            className="edit-photo"
            type="file"
            id="photo"
            name="photo"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setPhotoFile(e.target.files[0]);
              }
            }}
          />
  
          <div className="update-and-cancel-btns">
            <Button className="update-contact-btn" type="submit">Update Contact</Button>
            <button className="edit-contact-cancel-btn" type="button" onClick={() => {navigate(-1)}}>Cancel</button>
          </div>
        </form>
      )}
      
    </div>
  );
}
