import './SearchBar.css';

export default function SearchBar(props) {
    const classes = 'searchbar ' + props.className;

  return (
    <input className={classes} type="text" name="contact-search" id="contact-search" placeholder="search contacts" onClick={props.onClick} onChange={props.onChange} />
  )
}
