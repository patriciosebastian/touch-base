import React, { createContext, useState, useCallback } from "react";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  // Get all contacts
  // useCallback to memoize fetchContacts
  const fetchContacts = useCallback(async () => {
    const response = await fetch("http://localhost:5300/contacts");
    const fetchedContacts = await response.json();
    setContacts(fetchedContacts);

    if (response.ok) {
        console.log('Request successful');
    } else {
        console.error('Error:', response);
    }
  }, []);

  // Create contact
  const addContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
    console.log('Contact created successfully');
  };

  // Update contact
  const updateContact = async (contacts_id, updatedContact) => {
    const response = await fetch(`http://localhost:5300/contacts/${contacts_id}`, {
      method: "PUT",
      body: updatedContact,
    });

    if (!response.ok) {
      throw new Error("Failed to update contact");
    }

    const updatedContactJson = await response.json();

    if (response.ok) {
      setContacts((prevContacts) => {
        return prevContacts.map((contact) =>
          contact.contacts_id === contacts_id ? updatedContactJson : contact
        );
      });
      console.log("Contact updated successfully");
      // Confirm to user that update was successful. Exit modal.
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    const response = await fetch(`http://localhost:5300/contacts/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error('Failed to delete contact');
    }
    if (response.ok) {
        setContacts((prevContacts) => {
            return prevContacts.filter((contact) => contact.contacts_id !== id);
        });
        console.log("Contact deleted successfully");
    }
  }

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, fetchContacts, updateContact, deleteContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
