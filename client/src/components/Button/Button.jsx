import './Button.css';

export default function Button (props) {
    const classes = 'button ' + props.className;

    return <button className={classes} disabled={props.disabled} type={props.type}>{props.children}</button>
}