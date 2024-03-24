import SideNav from "../../components/SideNav/SideNav";
import useMedia from "../../hooks/useMedia";
import Button from "../../components/Button/Button";
import "./ImportContacts.css";

export default function ImportContacts() {
  const isDesktop = useMedia("(min-width: 1200px)");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);

    // what are some papa parse examples?
    // and how am I using Context?
    // remember to use loading state
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // send file to backend using fetch. consider context
      // example:
      fetch('/import-contacts', {
        method: 'POST',
        body: formData
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

      {/* remove this btn */}
      <Button className='import-contacts-btn'>
        Import Contacts
      </Button>
      <input type="file" accept=".csv" onChange={handleFileUpload} value="Import Contacts" />
    </div>
  );
}
