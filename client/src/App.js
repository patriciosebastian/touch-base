import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContactsProvider } from "./components/Context/ContactsContext";
import { AuthProvider } from "./components/Context/AuthContext";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import CreateContact from "./components/CreateContact/CreateContact";
import ViewContacts from "./components/ViewContacts/ViewContacts";
import EditContact from "./components/EditContact/EditContact";
import ContactDetails from "./components/ContactDetails/ContactDetails";
import SignIn from "./components/Auth/SignIn/SignIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import Account from "./components/Account/Account";
import PrivateRoutes from "./components/Auth/PrivateRoutes";

function App() {
  return (
    <AuthProvider>
      <ContactsProvider>
        <Router>
          <Nav />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/account" element={<Account />} />
              <Route path="/create-contact" element={<CreateContact />} />
              <Route path="/view-contacts" element={<ViewContacts />} />
              <Route path="/contacts/:id" element={<ContactDetails />} />
              <Route path="/edit-contact/:id" element={<EditContact />} /> {/* Should I make this a modal? */}
            </Route>
          </Routes>
        </Router>
      </ContactsProvider>
    </AuthProvider>
  );
}

export default App;
