import './Dropdown.css';

export default function Dropdown(props) {
  const classes = 'dropdown ' + props.className;

  return (
    <ul className={classes}>{props.children}</ul>
  )
}
