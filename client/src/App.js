import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContactsProvider } from "./components/Context/ContactsContext";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import CreateContact from "./components/CreateContact/CreateContact";
import ViewContacts from "./components/ViewContacts/ViewContacts";
import EditContact from "./components/EditContact/EditContact";

function App() {
  return (
    <Router>
      <Nav />
      <ContactsProvider>
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route path="/create-contact" Component={CreateContact} />
          <Route path="/view-contacts" Component={ViewContacts} />
          <Route path="/edit-contact/:id" Component={EditContact} /> {/* EditContact will become a link or button that opens a modal */}
        </Routes>
      </ContactsProvider>
    </Router>
  );
}

export default App;
