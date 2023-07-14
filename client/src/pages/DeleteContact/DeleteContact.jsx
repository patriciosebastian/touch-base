import { useContext } from "react";
import { ContactsContext } from "../../context/ContactsContext";
import { useNavigate } from "react-router-dom";
import "../DeleteContact/DeleteContact.css";

//not sure if I want this as a button or something else
export default function DeleteContact({ id }) {
  const { deleteContact } = useContext(ContactsContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(id);
        navigate("/view-contacts");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return <button onClick={handleDelete}>Delete Contact</button>;
}
