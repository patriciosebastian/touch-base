import React, { createContext, useState, useCallback, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get all user contacts
  // useCallback to memoize fetchContacts
  const fetchContacts = useCallback(async () => {
    let idToken = '';
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }

    const response = await fetch("http://localhost:5300/contacts", {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      console.error('Error:', response);
      return;
    }

    const fetchedContacts = await response.json();
    setContacts(fetchedContacts);

    if (response.ok) {
        console.log('Request successful');
    } else {
        console.error('Error:', response);
    }
  }, []);

  // Create contact
  const addContact = async (newContact) => {
    let idToken = '';
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }

    const response = await fetch('http://localhost:5300/contacts', {
      method: "POST",
      body: newContact,
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create contact');
    }

    const newContactJson = await response.json();
    setContacts((prevContacts) => [...prevContacts, newContactJson]);
    console.log('Contact created successfully');
  };

  // Update contact
  const updateContact = async (contacts_id, updatedContact) => {
    let idToken = '';
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }

    const response = await fetch(`http://localhost:5300/contacts/${contacts_id}`, {
      method: "PUT",
      body: updatedContact,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update contact");
    };

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
    let idToken = '';
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }

    const response = await fetch(`http://localhost:5300/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`
        },
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, fetchContacts, updateContact, deleteContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
