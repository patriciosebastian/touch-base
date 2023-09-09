import { useEffect, useContext, useState, useRef } from "react";
import { ContactsContext } from "../../context/ContactsContext";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { formatPhoneNumber } from "../../utils/utils";
import { LuEye, LuEdit3, LuMail, LuPlus } from "react-icons/lu";
import { CgClose } from "react-icons/cg";
import useOutsideClick from "../../hooks/useOutsideClick";
import DeleteAction from "../DeleteAction/DeleteAction";
import MoreOptions from "../../components/MoreOptions/MoreOptions";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import useMedia from "../../hooks/useMedia";
import SideNav from "../../components/SideNav/SideNav";
import g6 from '../../assets/g6.svg';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "../ViewContacts/ViewContacts.css";

export default function ViewContacts() {
  const { contacts, fetchContacts, emailContact, deleteContact } = useContext(ContactsContext);
  const { idToken, authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactToEmail, setContactToEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [deletingContactId, setDeletingContactId] = useState(null);
  const [disabledAppearance, setDisabledAppearance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const searchResultsRef = useRef(null);
  const isDesktop = useMedia('(min-width: 1200px)');

  // fetch contacts
  useEffect(() => {
    const fetchContactData = async () => {
      if (auth.currentUser && idToken && !authLoading) {
        await fetchContacts();
        setFilteredContacts(contacts);
        setLoading(false);
      } else if (!authLoading) {
        console.log("User not signed in");
        setLoading(false);
      }
    };

    fetchContactData();
  }, [fetchContacts, idToken, authLoading]);

  // search query results
  useEffect(() => {
    const results = contacts.filter((contact) => {
      // convert query to lowercase for case-insensitive search
      const lowerCaseQuery = searchQuery.toLowerCase();

      // check if first name or last name starts with search query
      return (
        (contact.first_name ? contact.first_name.toLowerCase().startsWith(lowerCaseQuery) : false) ||
        (contact.last_name ? contact.last_name.toLowerCase().startsWith(lowerCaseQuery) : false)
      );
    });

    setFilteredContacts(results);
  }, [searchQuery, contacts]);

  useOutsideClick(searchResultsRef, () => setSearchQuery(""));

  const handleModalAndContact = (contactId, first_name) => {
    setSubject("");
    setMessage("");
    setIsModalOpen(true);
    setContactToEmail(contactId);
    setFirstName(first_name);
  };

  const sendEmail = async (contacts_id, subject, message) => {
    try {
      setSendingEmail(true);
      await emailContact(contacts_id, subject, message);
      setSubject("");
      setMessage("");
      setSendingEmail(false);

      console.log("Email sent successfully");
    } catch (err) {
      console.error(err);
      console.log("Failed to send email to contact");
      setSendingEmail(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await deleteContact(contactId);
      setDeletingContactId(null);
      setDisabledAppearance(false);
      // any other post-delete logic
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setDeletingContactId(null);
    setDisabledAppearance(false);
  }

  return (
    <div>
      <div className="view-contacts-container">
        <div className="top-controls-container" style={{ backgroundImage: `url(${g6})`, height: "100%", width: "100%" }}>
          {/* MAIN HEADING */}
          <div className="main-heading-flex-container">
            <h1 className="view-contacts-main-heading">Contacts</h1>
            <Link className="create-contact-link" to={"create-contact"}>
              <LuPlus className="create-contact-icon" />
            </Link>
          </div>
          {/* SEARCH BAR */}
          <SearchBar
            className="view-contacts-search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="search-results-container" ref={searchResultsRef}>
            {searchQuery &&
              filteredContacts.map((contact) => (
                <li key={contact.contacts_id}>
                  <Link to={"/app/contacts/" + contact.contacts_id}>
                    {contact.first_name}&nbsp;{contact.last_name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        {/* SIDE NAV */}
        {isDesktop && <SideNav className="view-contacts-side-nav" />}
        {/* CONTACTS CONTAINER */}
        {loading ? <LoadingSpinner /> : (
          <div className="contacts-container">
            {contacts.map((contact) => (
              <div key={contact.contacts_id} className="contact-container">
                <div className={`contact-card-control-left + ${disabledAppearance && contact.contacts_id === deletingContactId ? "disabled-appearance" : ""}`}>
                  <h1>
                    {contact.first_name} {contact.last_name}
                  </h1>
                  <p>{formatPhoneNumber(contact.phone)}</p>
                  <p>{contact.email}</p>
                </div>
                <div className="contact-card-control-right">
                  {contact.contacts_id === deletingContactId ? (
                    <div className="delete-contact-confirmation">
                      <span>Are you sure you want to delete this contact?</span>
                      <div className="delete-contact-btns-control">
                        <Button className="cancel-delete-contact-btn" onClick={() => handleCancelDelete()}>Cancel</Button>
                        <Button className="confirm-delete-contact-btn" onClick={() => {
                          handleDeleteContact(contact.contacts_id)
                        }}>Yes</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <MoreOptions className="vc-more-options">
                        <Link to={"/app/contacts/" + contact.contacts_id}>
                          <LuEye className="view-contact-icon" />
                        </Link>
                        <li
                          className="vc-email-contact"
                          onClick={() =>
                            handleModalAndContact(
                              contact.contacts_id,
                              contact.first_name
                            )
                          }
                        >
                          <LuMail className="email-contact-icon"></LuMail>
                        </li>
                        <Link
                          className="edit-contact-link"
                          to={"/app/edit-contact/" + contact.contacts_id}
                        >
                          <LuEdit3 className="edit-contact-icon" />
                        </Link>
                        <li className="vc-delete-contact">
                          <DeleteAction
                            className="delete-contact-icon"
                            id={contact.contacts_id}
                            confirmationMessage="Are you sure you want to delete this contact?"
                            onDelete={handleDeleteContact}
                            itemType="contact"
                            isOutsideDropdown={false}
                            setDeletingContactId={setDeletingContactId}
                            setDisabledAppearance={setDisabledAppearance}
                          />
                        </li>
                      </MoreOptions>
                      <img
                        src={contact.photo_url}
                        alt={
                          "portrait of " +
                          contact.first_name +
                          " " +
                          contact.last_name
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* EMAIL MODAL */}
            {isModalOpen && (
              <Modal
                className="email-contact-modal"
                closeModal={() => setIsModalOpen(false)}
              >
                <div className="close-modal-control">
                  <button
                    className="close-modal-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <CgClose />
                  </button>
                </div>
                <h2 className="email-contact-modal-header">Email {firstName}</h2>
                {sendingEmail ? <LoadingSpinner /> : (
                  <div className="vc-email-container">
                    <input
                      className="email-contact-subject"
                      type="text"
                      placeholder="Subject"
                      name="subject"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <textarea
                      className="email-contact-textarea"
                      placeholder="Message"
                      name="message"
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <Button
                      className="send-contact-email-btn"
                      onClick={() => sendEmail(contactToEmail, subject, message)}
                    >
                      Send Email
                    </Button>
                  </div>
                )}
              </Modal>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
