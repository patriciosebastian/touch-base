import { useState, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from '../Dropdown/Dropdown';
import useOutsideClick from '../../hooks/useOutsideClick';
import './MoreOptions.css';

export default function MoreOptions(props) {
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
    const ref = useRef(null);
    const classes = 'more-options-container ' + props.className;

    useOutsideClick(ref, () => setIsMoreOptionsOpen(false));

  return (
    <div className={classes} ref={ref}>
      <div>
        <BsThreeDots className="more-options-icon" onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)} />
      </div>
      <Dropdown className={`more-options-ul ${isMoreOptionsOpen ? '' : 'hidden'}`}>{props.children}</Dropdown>
    </div>
  )
}