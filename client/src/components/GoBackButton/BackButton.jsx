import { useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import './BackButton.css'

export default function BackButton(props) {
    const navigate = useNavigate();
    const classes = 'back-btn ' + props.className;

  return (
    <button className={classes} onClick={() => navigate(-1)}><LuArrowLeft />Go Back</button>
  )
}
