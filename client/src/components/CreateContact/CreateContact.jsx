import { useState, useContext } from 'react';
import { ContactsContext } from '../Context/ContactsContext';
import '../CreateContact/CreateContact.css';

export default function CreateContact() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [categories, setCategories] = useState('');
    const [description, setDescription] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    
    const { addContact } = useContext(ContactsContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const data = new FormData();
        data.append('first_name', first_name);
        data.append('last_name', last_name);
        data.append('email', email);
        data.append('phone', phone);
        data.append('address1', address1);
        data.append('address2', address2);
        data.append('city', city);
        data.append('state', state);
        data.append('zip', zip);
        data.append('categories', categories);
        data.append('description', description);
        data.append('photo', photoFile);
      
        const response = await fetch('http://localhost:5300/contacts', {
          method: 'POST',
          // No 'Content-Type' header when sending FormData
          body: data,
        });
      
        if (response.ok) {
          console.log('Contact added successfully');
          const newContact = await response.json();
          console.log(newContact); // remove after verifying
          addContact(newContact);
          // Clear the form or redirect the user. (Not sure what I'm doing yet).
        } else {
          console.error('Error:', response);
        }
    };

    return (
        <div>
          <h1>Create Contact</h1>
          <form id='create-contact-form' encType='multipart/form-data' autoComplete='on' onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name</label>
            <input type="text" id='first_name' name='first_name' value={first_name} onChange={e => setFirstName(e.target.value)} required />

            <label htmlFor="last_name">Last Name</label>
            <input type="text" id='last_name' name='last_name' value={last_name} onChange={e => setLastName(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' value={email} onChange={e => setEmail(e.target.value)} />

            <label htmlFor="phone">Phone</label>
            <input type="tel" id='phone' name='phone' value={phone} onChange={e => setPhone(e.target.value)} />

            <label htmlFor="address1">Address 1</label>
            <input type="text" id='address1' name='address1' value={address1} onChange={e => setAddress1(e.target.value)} />

            <label htmlFor="address2">Address 2</label>
            <input type="text" id='address2' name='address2' value={address2} onChange={e => setAddress2(e.target.value)} />

            <label htmlFor="city">City</label>
            <input type="text" id='city' name='city' value={city} onChange={e => setCity(e.target.value)} />

            <label htmlFor="state">State</label>
            <input type="text" id='state' name='state' value={state} onChange={e => setState(e.target.value)} />

            <label htmlFor="zip">Zip</label>
            <input type="number" id='zip' name='zip' value={zip} onChange={e => setZip(e.target.value)} />

            <label htmlFor="categories">Categories</label>
            <input type="text" id='categories' name='categories' value={categories} onChange={e => setCategories(e.target.value)} />
            
            <label htmlFor="description">Description</label>
            <input type="text" id='description' name='description' value={description} onChange={e => setDescription(e.target.value)} />

            <label htmlFor="photo">Select a photo:</label>
            <input type="file" id='photo' name='photo' onChange={e => setPhotoFile(e.target.files[0])} />

            <input type="submit" value={"Submit"} />
          </form>
        </div>
    )
}