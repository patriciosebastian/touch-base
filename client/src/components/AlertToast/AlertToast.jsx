import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import './AlertToast.css';

export default function AlertToast({ message, type, duration = 3000, onDismiss }) {
    const [alertToastVisible, setAlertToastVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        dismissToast();
      }, duration);

      return () => clearTimeout(timer);
      //eslint-disable-next-line
    }, [duration]);

    const dismissToast = () => {
        setAlertToastVisible(false);
        if (onDismiss) onDismiss();
    };

  return alertToastVisible ? (
    <div className={`toast-alert ${type}`}>
      <div className="toast-content">
        {message}
      </div>
      <CgClose className="close-toast-icon" onClick={dismissToast} />
    </div>
  ) : null;
}
