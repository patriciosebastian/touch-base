import SideNav from "../../components/SideNav/SideNav";
import useMedia from "../../hooks/useMedia";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "./ImportContacts.css";
import AlertToast from "../../components/AlertToast/AlertToast";

export default function ImportContacts() {
  const isDesktop = useMedia("(min-width: 1200px)");
  const { idToken, backendURL } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toastAlert, setToastAlert] = useState({
    visible: false,
    message: "",
    type: "",
  });

  const handleFileUpload = (e) => {
    setLoading(true);

    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch(`${backendURL}/app/import-contacts`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setLoading(false);
          setToastAlert({
            visible: true,
            message: data.error,
            type: 'error'
          });
          return;
        }

        setLoading(false);
        setToastAlert({
          visible: true,
          message: data.message || 'Contacts imported successfully!',
          type: 'success'
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
        setToastAlert({
          visible: true,
          message: 'Error importing contacts. Please refresh the page and try again.',
          type: 'error'
        });
      });
    } else {
      console.log('No file selected');
      setLoading(false);
      setToastAlert({
        visible: true,
        message: 'No file selected. Please select a file and try again.',
        type: 'error'
      });
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "first_name,last_name,email,phone,address1,address2,city,state,zip,categories,notes\nJohn,Doe,john.doe@example.com,555-1234,123 Main St,Apt 4B,Springfield,IL,62701,Family,Example contact";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='import-contacts-container'>
      <h1 className='import-contacts-main-heading'>Import Contacts</h1>
      <p className='csv-copy'>Import contacts by uploading a CSV file with your contacts information.</p>
      {isDesktop && <SideNav className='import-contacts-side-nav' />}

      <div className='csv-instructions'>
        <h2 className='csv-instructions-heading'>CSV Requirements</h2>
        <p className='csv-instructions-text'>Your CSV file must include the following column names (header row):</p>
        <ul className='csv-columns-list'>
          <li><strong>first_name</strong> (required)</li>
          <li>last_name</li>
          <li>email</li>
          <li>phone</li>
          <li>address1</li>
          <li>address2</li>
          <li>city</li>
          <li>state</li>
          <li>zip</li>
          <li>categories</li>
          <li>notes</li>
        </ul>
        <p className='csv-instructions-note'>Note: Column names must match exactly. Only <strong>first_name</strong> is required, all other fields are optional.</p>
        <button className='download-template-btn' onClick={handleDownloadTemplate}>
          Download Sample CSV Template
        </button>
      </div>

      {loading ?
        <LoadingSpinner />
        :
        <div className='csv-upload-section'>
          <h3 className='csv-upload-heading'>Upload Your CSV File</h3>
          <input className="import-contacts-input" type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
      }
      {toastAlert.visible && <AlertToast type={toastAlert.type} message={toastAlert.message} onDismiss={() => setToastAlert(prev => ({ ...prev, visible: false }))} />}
    </div>
  );
}
