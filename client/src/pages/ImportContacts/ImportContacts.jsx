import SideNav from "../../components/SideNav/SideNav";
import useMedia from "../../hooks/useMedia";
import { useAuth } from "../../context/AuthContext";
import "./ImportContacts.css";

export default function ImportContacts() {
  const isDesktop = useMedia("(min-width: 1200px)");
  const { idToken } = useAuth();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);

    // what are some papa parse examples?
    // and how am I using Context?
    // remember to use loading state
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // will have to use the $backendURL pattern after testing locally
      // send file to backend using fetch. consider context
      // example:
      fetch('http://localhost:5300/app/import-contacts', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <div className='import-contacts-container'>
      <h1 className='import-contacts-main-heading'>Import Contacts</h1>
      {isDesktop && <SideNav className='import-contacts-side-nav' />}

      <input className="" type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}
