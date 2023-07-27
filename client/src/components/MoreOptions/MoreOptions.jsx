import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from '../Dropdown/Dropdown';
import './MoreOptions.css';

export default function MoreOptions(props) {
    const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
    const classes = 'more-options-container ' + props.className;

  return (
    <div className={classes}>
      <div>
        <BsThreeDots className="more-options-icon" onClick={() => setMoreOptionsOpen(!moreOptionsOpen)} />
      </div>
      <Dropdown className={`more-options-ul ${moreOptionsOpen ? '' : 'hidden'}`}>{props.children}</Dropdown>
    </div>
  )
}
