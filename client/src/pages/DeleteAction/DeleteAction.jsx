import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import Button from "../../components/Button/Button";
import "./DeleteAction.css";

export default function DeleteAction({ id, confirmationMessage, onDelete, itemType, isOutsideDropdown, setDeletingContactId, setDisabledAppearance }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShowConfirmation = () => {
    if (isOutsideDropdown) {
      setShowConfirmation(true);
      setDeletingContactId(null);
    } else {
      setDeletingContactId(id);
      setDisabledAppearance(true);
    }
  };

  return (
    <>
      {showConfirmation ? (
        <>
          <span>{confirmationMessage}</span>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={() => {
            onDelete(id);
            setShowConfirmation(false);
          }}>Yes</Button>
        </>
      ) : (
        <LuTrash2 onClick={() => handleShowConfirmation()}>Delete {itemType}</LuTrash2>
      )}
    </>
  );
}
