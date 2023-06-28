import React, { createContext, useState, useCallback } from "react";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

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

  const addContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
    console.log('Contact created successfully');
  };

  const updateContact = async (id, updatedContact) => {
    const response = await fetch(`http://localhost:5300/contacts/${id}`, {
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
          contact.id === id ? updatedContactJson : contact
        );
      });
      console.log("Contact updated successfully");
      // Confirm to user that update was successful. Exit modal.
    }
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, fetchContacts, updateContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
