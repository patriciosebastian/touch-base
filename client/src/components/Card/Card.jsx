import './Card.css';

export default function Card (props) {
    const classes = 'card ' + props.className;

    return <div className={classes} style={props.style}>{props.children}</div>
}