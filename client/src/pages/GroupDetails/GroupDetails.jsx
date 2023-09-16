import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GroupsContext } from '../../context/GroupsContext';
import { ContactsContext } from '../../context/ContactsContext';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { sortContacts, formatPhoneNumber } from '../../utils/utils';
import { LuEye, LuEdit3, LuTrash2, LuCheck, LuMail } from 'react-icons/lu';
import { PiPlusThin } from 'react-icons/pi';
import { CgClose } from 'react-icons/cg';
import MoreOptions from '../../components/MoreOptions/MoreOptions';
import BackButton from '../../components/BackButton/BackButton';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AlertToast from '../../components/AlertToast/AlertToast';
import './GroupDetails.css';

export default function GroupDetails() {
    const [group, setGroup] = useState({});
    const [groupContacts, setGroupContacts] = useState([]);
    const [isAddContactsModalOpen, setIsAddContactsModalOpen] = useState(false);
    const [isEmailGroupModalOpen, setIsEmailGroupModalOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showDeleteGroupConfirmation, setShowDeleteGroupConfirmation] = useState(false);
    const [showRemoveContactConfirmation, setShowRemoveContactConfirmation] = useState(false);
    const [removingContactId, setRemovingContactId] = useState(null);
    const [disabledAppearance, setDisabledAppearance] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [loadingRemoveContact, setLoadingRemoveContact] = useState(false);
    const { getGroup, deleteContactFromGroup, deleteGroup, addContactToGroup, emailGroup } = useContext(GroupsContext);
    const { contacts, fetchContacts, toastAlert, setToastAlert } = useContext(ContactsContext);
    const { groupId } = useParams();
    const { idToken, authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchGroup = async () => {
        if (auth.currentUser && idToken) {
          try {
            const response = await getGroup(groupId);
            setGroup(response);
            // local contacts state for easily displaying updated contacts in UI
            setGroupContacts(response.contacts);
            console.log("Fetched group successfully (GD)");
          } catch (err) {
            console.error(err);
          }
        } else {
          console.log("User not logged in or idToken not available");
        }
      };

      if (!authLoading) {
        fetchGroup();
      }
    }, [getGroup, groupId, idToken, authLoading]);

    useEffect(() => {
      const fetchContactsData = async () => {
        if (idToken) {
          await fetchContacts();
        }
      };

      if (!authLoading) {
        fetchContactsData();
      }
      // eslint-disable-next-line
    }, [idToken, authLoading]);

    const sortedContacts = useMemo(() => {
      return sortContacts(groupContacts);
    }, [groupContacts]);

    const handleDeleteGroup = async (groupId) => {
      try {
        setLoading(true);
        await deleteGroup(groupId);
        setLoading(false);
        setShowDeleteGroupConfirmation(false);
        navigate("/app/groups");
        console.log("Group deleted successfully");
      } catch (err) {
        console.error(err);
        console.log("Failed to delete group");
        setLoading(false);
      }
    };

    const addToGroup = async (groupId, contactId) => {
      try {
        // first add the contact
        const updatedContacts = await addContactToGroup(groupId, contactId);
        // then update local contacts state
        setGroupContacts(updatedContacts.contacts || []);
        setToastAlert({
          visible: true,
          message: 'Contact added to group successfully!',
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        setToastAlert({
          visible: true,
          message: 'Failed to add contact to group',
          type: 'error'
        });
      }
    };

    const isContactInGroup = (contactId) => {
      return groupContacts.some(contact => contact.contacts_id === contactId);
    };

    const removeContact = async (groupId, contactId) => {
      try {
        setLoadingRemoveContact(true);
        // first delete from group
        const updatedContacts = await deleteContactFromGroup(groupId, contactId);
        // then update local contacts state
        setGroupContacts(updatedContacts.contacts || []);
        setShowRemoveContactConfirmation(false);
        setDisabledAppearance(false);
        setLoadingRemoveContact(false);
        setToastAlert({
          visible: true,
          message: 'Deleted contact from group successfully!',
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        alert("Failed to delete contact from group");
        setLoadingRemoveContact(false);
        setToastAlert({
          visible: true,
          message: 'Failed to delete contact from group!',
          type: 'error'
        });
      }
    };

    const handleIsEmailGroupModalOpen = () => {
      setSubject('');
      setMessage('');
      setIsEmailGroupModalOpen(true);
    };

    const sendEmail = async (groupId, subject, message) => {
      try {
        setSendingEmail(true);
        await emailGroup(groupId, subject, message);
        setSubject('');
        setMessage('');
        setSendingEmail(false);
        setIsEmailGroupModalOpen(false);
        setToastAlert({
          visible: true,
          message: 'Email sent successfully!',
          type: 'success'
        });
  
        console.log('Email sent successfully');
      } catch (err) {
        console.error(err);
        console.log('Failed to send email to group');
        setSendingEmail(false);
        setToastAlert({
          visible: true,
          message: 'Failed to send email!',
          type: 'error'
        });
      }
    };

    const handleShowRemoveConfirmation = (contactId) => {
      setShowRemoveContactConfirmation(true);
      setRemovingContactId(contactId);
      setDisabledAppearance(true);
    }

    const handleCancelRemove = () => {
      setRemovingContactId(null);
      setDisabledAppearance(false);
    }

  return (
    <div className="group-details-container">
      <div className="top-controls">
        <BackButton className="group-details-back-btn" />
        {showDeleteGroupConfirmation ? (
          <div className="delete-group-confirmation">
            <span>Delete this group?</span>
            {loading ? <LoadingSpinner className="delete-group-spinner" /> : (
              <div className="delete-group-btns-control">
                <Button className="cancel-delete-group-btn" onClick={() => setShowDeleteGroupConfirmation(false)}>Cancel</Button>
                <Button className="confirm-delete-group-btn" onClick={() => {
                  handleDeleteGroup(group.group_id)
                }}>Yes</Button>
              </div>
            )}
          </div>
        ) : (
          <button className="delete-group-btn" onClick={() => setShowDeleteGroupConfirmation(true)}><LuTrash2 className="delete-group-icon"></LuTrash2></button>
        )}
      </div>
      <div className="group-name-and-about-text" style={{ backgroundImage: `url(${group.cover_picture})`}}>
        <Link to={"/app/groups/edit-group/" + group.group_id} className="edit-group-btn"><LuEdit3 /></Link>
        <h1>{group.group_name}</h1>
        <p>{group.about_text}</p>
      </div>
      <h2>Contacts in Group</h2>
      <div className="center-controls">
        <span className="add-contacts-to-group" onClick={() => setIsAddContactsModalOpen(true)}>Add contacts&nbsp;<PiPlusThin /></span>
        <span className="gd-email-group" onClick={() => handleIsEmailGroupModalOpen()}>Email Group&nbsp;<LuMail className="email-contact-icon"></LuMail></span>
      </div>
      {isAddContactsModalOpen && (
        <Modal className="group-details-modal" closeModal={() => setIsAddContactsModalOpen(false)}>
          <div className="close-modal-control">
            <button className="close-modal-btn" onClick={() => setIsAddContactsModalOpen(false)}><CgClose /></button>
          </div>
          <h2 className="add-group-contacts-modal-header">Choose Contacts</h2>
          {contacts && contacts.map(contact => (
            <div key={contact.contacts_id} className="modal-contacts-container">
                <div className="modal-contact-info">
                    <img className="group-contact-img" src={contact.photo_url} alt={`portrait of ${contact.first_name}`} />&nbsp;
                    {`${contact.first_name} ` + contact.last_name}
                </div>
              {isContactInGroup(contact.contacts_id) ? (
                <Button className="contact-added-btn" disabled>Added&nbsp;<LuCheck /></Button>
              ) : (
                <Button className="modal-add-contact-btn" onClick={() => addToGroup(group.group_id, contact.contacts_id)}>Add Contact</Button>
              )}
            </div>
          ))}
        </Modal>
      )}
      {isEmailGroupModalOpen && (
        <Modal className="email-group-modal" closeModal={() => setIsEmailGroupModalOpen(false)}>
          <div className="close-modal-control">
            <button className="close-modal-btn" onClick={() => setIsEmailGroupModalOpen(false)}><CgClose /></button>
          </div>
          <h2 className="email-group-modal-header">Email {group.group_name}</h2>
          {sendingEmail ? <LoadingSpinner /> : (
            <div className="gd-email-container">
              <input className="email-group-subject" type="text" placeholder="Subject" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <textarea className="email-group-textarea" placeholder="Message" name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              <Button className="send-group-email-btn" onClick={() => sendEmail(group.group_id, subject, message)}>Send Email</Button>
            </div>
          )}
        </Modal>
      )}
      <div className="group-contacts-container">
        {groupContacts && sortedContacts.map((contact) => (
          <div key={contact.contacts_id} className="group-contact-container">
            <div className={`group-contact-card-control-left + ${disabledAppearance && removingContactId === contact.contacts_id ? "disabled-appearance" : ""}`}>
              <h1>
                {contact.first_name} {contact.last_name}
              </h1>
              <p>
                {formatPhoneNumber(contact.phone)}
              </p>
              <p>
                {contact.email}
              </p>
            </div>
            <div className="group-contact-card-control-right">
              {showRemoveContactConfirmation && removingContactId === contact.contacts_id ? (
                <div className="remove-contact-confirmation">
                  <span>Are you sure you want to remove this contact?</span>
                  {loadingRemoveContact ? <LoadingSpinner className="remove-contact-from-group-spinner" /> : (
                    <div className="remove-contact-btns-control">
                      <Button className="cancel-remove-contact-btn" onClick={() => handleCancelRemove()}>Cancel</Button>
                      <Button className="confirm-remove-contact-btn" onClick={() => {
                        removeContact(group.group_id, contact.contacts_id)
                      }}>Yes</Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <MoreOptions className="gd-more-options">
                    <Link to={"/app/contacts/" + contact.contacts_id}><LuEye className="view-contact-icon" /></Link>
                    {/* <span className="gd-email-group" onClick={() => handleModalAndContact(contact.contacts_id)}><LuMail className="email-group-icon"></LuMail></span> */}
                    <Link to={"/app/edit-contact/" + contact.contacts_id}><LuEdit3 className="edit-contact-icon" /></Link>
                    <span className="delete-contact-from-group" onClick={() => handleShowRemoveConfirmation(contact.contacts_id)}>Delete from group</span>
                  </MoreOptions>
                  <img
                    src={contact.photo_url}
                    alt={
                      "portrait of " + contact.first_name + " " + contact.last_name
                    }
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {toastAlert.visible && <AlertToast type={toastAlert.type} message={toastAlert.message} onDismiss={() => setToastAlert(prev => ({ ...prev, visible: false }))} />}
    </div>
  );
}
