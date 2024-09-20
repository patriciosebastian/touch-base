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

      // implement in context
      fetch(`https://${backendURL}/app/import-contacts`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          if (data.error === 'No new contacts to import') {
            setLoading(false);
            setToastAlert({
              visible: true,
              message: 'Only duplicate contacts found. No new contacts to import.',
              type: 'info'
            });
            return
          }
        }

        setLoading(false);
        setToastAlert({
          visible: true,
          message: 'Contacts imported successfully!',
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

  return (
    <div className='import-contacts-container'>
      <h1 className='import-contacts-main-heading'>Import Contacts</h1>
      <p className='csv-copy'>Import contacts by choosing your CSV file.</p>
      {isDesktop && <SideNav className='import-contacts-side-nav' />}

      {loading ?
        <LoadingSpinner />
        :
        <input className="import-contacts-input" type="file" accept=".csv" onChange={handleFileUpload} />
      }
      {toastAlert.visible && <AlertToast type={toastAlert.type} message={toastAlert.message} onDismiss={() => setToastAlert(prev => ({ ...prev, visible: false }))} />}
    </div>
  );
}
