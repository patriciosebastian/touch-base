import { useState, useEffect, useContext } from 'react';
import { ContactsContext } from '../Context/ContactsContext';
import { useParams } from 'react-router-dom';
import '../EditContact/EditContact.css';

export default function EditContact() {
    const { id } = useParams();
    const { updateContact } = useContext(ContactsContext);
    const [contact, setContact] = useState({});
    const [photoFile, setPhotoFile] = useState(null);

    // Get most up to date info for the contact,
    // monitor state of contact based on id
    useEffect(() => {
        const fetchContact = async () => {
            const response = await fetch(`http://localhost:5300/contacts/${id}`);
            const data = await response.json();
            setContact(data);
            setPhotoFile(data.photoFile);
            if (response.ok) {
                console.log("Contact fetched successfully")
                console.log(data);
            } else {
                console.error('Error:', response);
                // display message and re-route user.
            }
        }

        fetchContact();
    }, [id]);

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.entries(contact).forEach(([key, value]) => {
            data.append(key, value);
        })

        if (photoFile) {
            data.append('photo', photoFile);
        }

        await updateContact(contact.contacts_id, data);
        // give confirmation to user that contact was updated.
        // route user back to previous navigation.
    };

    return (
        <div>
          <h1>Edit Contact</h1>
          <form id='edit-contact-form' encType='multipart/form-data' onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name</label>
            <input type="text" id='first_name' name='first_name' value={contact.first_name || ''} onChange={handleChange} required />

            <label htmlFor="last_name">Last Name</label>
            <input type="text" id='last_name' name='last_name' value={contact.last_name || ''} onChange={handleChange} />

            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' value={contact.email || ''} onChange={handleChange} />

            <label htmlFor="phone">Phone</label>
            <input type="tel" id='phone' name='phone' value={contact.phone || ''} onChange={handleChange} />

            <label htmlFor="address1">Address 1</label>
            <input type="text" id='address1' name='address1' value={contact.address1 || ''} onChange={handleChange} />

            <label htmlFor="address2">Address 2</label>
            <input type="text" id='address2' name='address2' value={contact.address2 || ''} onChange={handleChange} />

            <label htmlFor="city">City</label>
            <input type="text" id='city' name='city' value={contact.city || ''} onChange={handleChange} />

            <label htmlFor="state">State</label>
            <input type="text" id='state' name='state' value={contact.state || ''} onChange={handleChange} />

            <label htmlFor="zip">Zip</label>
            <input type="number" id='zip' name='zip' value={contact.zip || ''} onChange={handleChange} />

            <label htmlFor="categories">Categories</label>
            <input type="text" id='categories' name='categories' value={contact.categories || ''} onChange={handleChange} />
            
            <label htmlFor="description">Description</label>
            <input type="text" id='description' name='description' value={contact.description || ''} onChange={handleChange} />

            <label htmlFor="photo">Select a photo:</label>
            <input type="file" id='photo' name='photo' onChange={e => {if(e.target.files.length > 0) {setPhotoFile(e.target.files[0])}}} />

            <button type='submit'>Update Contact</button>
          </form>
        </div>
    )
}