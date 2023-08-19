import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContactsContext } from "../../context/ContactsContext";
import { CgClose } from "react-icons/cg";
import Button from "../../components/Button/Button";
import "./CreateContact.css";

export default function CreateContact() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [categories, setCategories] = useState("");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const { addContact } = useContext(ContactsContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("first_name", first_name);
    data.append("last_name", last_name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("address1", address1);
    data.append("address2", address2);
    data.append("city", city);
    data.append("state", state);
    data.append("zip", zip);
    data.append("categories", categories);
    data.append("notes", notes);
    data.append("photo", photoFile);

    const newContact = data;
    addContact(newContact);
    // add loading state. Clear the form, give confirmation to user.
    navigate('/app');
  };

  return (
    <div className="create-contact-container">
      <div className="create-contact-header">
        <h1>Create Contact</h1>
        <Link to={'/app'}><CgClose /></Link>
      </div>
      <form className="create-contact-form" id="create-contact-form" encType="multipart/form-data" autoComplete="on" onSubmit={handleSubmit}>

        {/* name */}
        <div className="first-and-last-name-container">
          <div className="first-name-control">
            <label htmlFor="first_name">First Name</label>
            <input className="first-name" type="text" id="first_name" name="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
          </div>

          <div className="last-name-control">
            <label htmlFor="last_name">Last Name</label>
            <input className="last-name" type="text" id="last_name" name="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        {/* email & phone */}
        <div className="email-and-phone-container">
          <div className="phone-control">
            <label htmlFor="phone">Phone</label>
            <input className="phone" type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="email-control">
            <label htmlFor="email">Email</label>
            <input className="email" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        {/* address */}
        <div className="address-container">
          <div className="address1-control">
            <label htmlFor="address1">Address 1</label>
            <input className="address1" type="text" id="address1" name="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
          </div>

          <div className="address2-control">
            <label htmlFor="address2">Address 2</label>
            <input className="address2" type="text" id="address2" name="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
          </div>
        </div>

        {/* city, state, zip */}
        <div className="city-state-zip-container">
          <div className="city-control">
            <label htmlFor="city">City</label>
            <input className="city" type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="state-control">
            <label htmlFor="state">State</label>
            <input className="state" type="text" id="state" name="state" value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="zip-control">
            <label htmlFor="zip">Zip</label>
            <input className="zip" type="number" id="zip" name="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </div>

        {/* groups and notes */}
        <div className="categories-and-notes-container">
          <div className="categories-control">
            <label htmlFor="categories">Categories</label>
            <input className="categories" type="text" id="categories" name="categories" value={categories} onChange={(e) => setCategories(e.target.value)} />
          </div>

          <div className="notes-control">
            <label htmlFor="notes">Notes</label>
            <input className="notes" type="text" id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        {/* photo */}
        <div className="photo-control">
          <label htmlFor="photo">Select a photo:</label>
          <input className="select-photo" type="file" id="photo" name="photo" onChange={(e) => setPhotoFile(e.target.files[0])} />
        </div>

        {/* submit & cancel */}
        <div className="submit-and-cancel-container">
          <input className="create-contact-submit" type="submit" value={"Submit"} />
          <Link to={'/app'}><Button className="cancel-button">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
