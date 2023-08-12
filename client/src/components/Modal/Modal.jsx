import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal(props) {
  const classes = "modal-overlay " + props.className;

  return ReactDOM.createPortal(
    <div className={classes}>
      <div className="modal-content">{props.children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}
