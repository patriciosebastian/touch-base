import SideNav from "../../components/SideNav/SideNav";
import useMedia from "../../hooks/useMedia";
import Button from "../../components/Button/Button";
import "./ImportContacts.css";

export default function ImportContacts() {
  const isDesktop = useMedia("(min-width: 1200px)");

  return (
    <div className='import-contacts-container'>
      <h1 className='import-contacts-main-heading'>Import Contacts</h1>
      {isDesktop && <SideNav className='import-contacts-side-nav' />}

      <Button className='import-contacts-btn'>
        Import Contacts
      </Button>
    </div>
  );
}
