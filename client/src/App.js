import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContactsProvider } from "./context/ContactsContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home/Home";
import SignUp from "./auth/SignUp/SignUp";
import SignIn from "./auth/SignIn/SignIn";
import Account from "./pages/Account/Account";
import CreateContact from "./pages/CreateContact/CreateContact";
import ViewContacts from "./pages/ViewContacts/ViewContacts";
import ContactDetails from "./pages/ContactDetails/ContactDetails";
import EditContact from "./pages/EditContact/EditContact";
import PrivateRoutes from "./auth/PrivateRoutes";
import Nav from "./components/Nav/Nav";
import Groups from "./pages/Groups/Groups";
import Favorites from "./pages/Favorites/Favorites";
// import MainLayout from "./components/MainLayout/MainLayout";

function App() {
  return (
    <AuthProvider>
      <ContactsProvider>
        <Router>
          {/* <Nav /> */}
          <Routes>
            <Route element={<Nav />}>
              <Route exact path="/" element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Route>
            <Route path="/app" element={<PrivateRoutes />}>
              <Route path="/app" element={<ViewContacts />} />
              <Route path="/app/account" element={<Account />} />
              <Route path="/app/create-contact" element={<CreateContact />} />
              <Route path="/app/contacts/:id" element={<ContactDetails />} />
              <Route path="/app/edit-contact/:id" element={<EditContact />} /> {/* Should I make this a modal? */}
              <Route path="/app/groups" element={<Groups />} />
              <Route path="/app/favorites" element={<Favorites />} />
            </Route>
          </Routes>
        </Router>
      </ContactsProvider>
    </AuthProvider>
  );
}

export default App;
