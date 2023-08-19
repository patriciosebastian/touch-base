import { useRef } from 'react';
import ReactDOM from 'react-dom';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Modal.css';

const Modal = (props) => {
  const ref = useRef(null);
  const classes = "modal-overlay " + props.className;

  useOutsideClick(ref, props.closeModal);

  return ReactDOM.createPortal(
    <div className={classes}>
      <div className="modal-content" ref={ref}>{props.children}</div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;