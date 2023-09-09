import './LoadingSpinner.css';

export default function LoadingSpinner(props) {
  const classes = "loading-spinner " + props.className;
  return (
    <div className={classes}></div>
  )
}
