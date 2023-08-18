// sort contacts
export const sortContacts = (contacts) => {
  return contacts.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return -1;
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return 1;
    if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1;
    if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
    return 0;
  });
};

// format phone number
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

// click outside to close
export const clickOutsideToClose = (targetElement, callback) => {
  function handleClickOutside(e) {
    if (!targetElement.contains(e.target)) {
      callback();
    }
  }
  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}