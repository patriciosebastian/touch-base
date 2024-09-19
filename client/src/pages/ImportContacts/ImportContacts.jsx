import SideNav from "../../components/SideNav/SideNav";
import useMedia from "../../hooks/useMedia";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "./ImportContacts.css";

export default function ImportContacts() {
  const isDesktop = useMedia("(min-width: 1200px)");
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setLoading(true);

    const file = e.target.files[0];

    // remember to use loading state
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // will have to use the $backendURL pattern after testing locally
      // implement in context
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
    } else {
      console.log('No file selected');
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className='import-contacts-container'>
      <h1 className='import-contacts-main-heading'>Import Contacts</h1>
      {isDesktop && <SideNav className='import-contacts-side-nav' />}

      {loading ? <LoadingSpinner />
        :
        <input className="import-contacts-input" type="file" accept=".csv" onChange={handleFileUpload} />
      }
    </div>
  );
}
