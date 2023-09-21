import { createContext, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";

export const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const { idToken, backendURL } = useAuth();

  // Create a group
  const addGroup = async (group_name, about_text, cover_picture) => {
    const formData = new FormData();
    formData.append('group_name', group_name);
    formData.append('about_text', about_text);
    if (cover_picture) {
        formData.append('cover_picture', cover_picture);
    }

    const response = await fetch(`${backendURL}/app/groups`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create group');
    }

    const newGroupJson = await response.json();
    setGroups((prevGroups) => [...prevGroups, newGroupJson]);

    console.log('Group created successfully');
  };

  // Add contact to a group
  const addContactToGroup = async (group_id, contacts_id) => {
    const response = await fetch(`${backendURL}/app/groups/${group_id}/contacts/${contacts_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to add contact to group');
    }

    const updatedGroup = await response.json();

    setGroups(prevGroups => {
        return prevGroups.map(group => group.group_id === group_id ? updatedGroup : group);
    });

    console.log('Contact added to group successfully');
    return updatedGroup;
  };

  // Get all groups
  const fetchGroups = useCallback(async () => {
    const response = await fetch(`${backendURL}/app/groups`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        console.error('Error:', response);
        return;
    }

    const fetchedGroups = await response.json();
    setGroups(fetchedGroups);

    console.log('Request successful');
    // return groups;
    return fetchedGroups;
  }, [idToken, backendURL]);

  // Get a group
  const getGroup = async (group_id) => {
    const response = await fetch(`${backendURL}/app/groups/${group_id}`, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${idToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to get group');
    }
  
    const group = await response.json();
  
    console.log('Fetched group successfully');
    return group;
  };

  // Update a group
  const updateGroup = async (group_id, group_name, about_text, cover_picture) => {
    const formData = new FormData();
    formData.append('group_name', group_name);
    formData.append('about_text', about_text);
    if (cover_picture) {
        formData.append('cover_picture', cover_picture);
    }

    const response = await fetch(`${backendURL}/app/groups/${group_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update group");
    };

    const updatedGroup = await response.json();

    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.group_id === group_id ? updatedGroup : group
      )
    );

    console.log("Group updated successfully");
    // Confirm to user that update was successful.
  };

  // Delete a group
  const deleteGroup = async (group_id) => {
    const response = await fetch(`${backendURL}/app/groups/${group_id}`, {
      method: "DELETE",
      headers: {
          Authorization: `Bearer ${idToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }
  
    setGroups((prevGroups) => prevGroups.filter(group => group.group_id !== group_id));
  
    console.log('Group deleted successfully');
    return groups;
  };

  // Delete a contact from a group
  const deleteContactFromGroup = async (group_id, contacts_id) => {
    const response = await fetch(`${backendURL}/app/groups/${group_id}/contacts/${contacts_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete contact from group');
    }

    const updatedGroup = await response.json();

    setGroups(prevGroups => {
        return prevGroups.map(group => group.group_id === group_id ? updatedGroup : group);
    });

    console.log('Contact deleted from group successfully');
    return updatedGroup;
  };

  // Email group
  const emailGroup = async (group_id, subject, message) => {
    const response = await fetch(`${backendURL}/app/groups/${group_id}/email`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ subject, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to email group');
    }

    console.log("Email sent successfully");
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, addContactToGroup, fetchGroups, getGroup, updateGroup, deleteGroup, deleteContactFromGroup, emailGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}