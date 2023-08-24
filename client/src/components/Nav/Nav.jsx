import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import "./Nav.css";

export default function Nav(props) {
  const classes = 'nav-items ' + props.className;

  return (
    <>
      <nav className={classes}>
        <HamburgerMenu />
      </nav>
    </>
  );
}
