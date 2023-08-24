import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContactsProvider } from "./context/ContactsContext";
import { GroupsProvider } from "./context/GroupsContext";
import Home from "./pages/Home/Home";
import SignUp from "./auth/SignUp/SignUp";
import SignIn from "./auth/SignIn/SignIn";
import Account from "./pages/Account/Account";
import CreateContact from "./pages/CreateContact/CreateContact";
import ViewContacts from "./pages/ViewContacts/ViewContacts";
import ContactDetails from "./pages/ContactDetails/ContactDetails";
import EditContact from "./pages/EditContact/EditContact";
import PublicNav from "./components/PublicNav/PublicNav";
import Navbar from "./components/Navbar/Navbar";
import PrivateRoutes from "./auth/PrivateRoutes";
import Favorites from "./pages/Favorites/Favorites";
import ViewGroups from "./pages/ViewGroups/ViewGroups";
import CreateGroup from "./pages/CreateGroup/CreateGroup";
import GroupDetails from "./pages/GroupDetails/GroupDetails";
import EditGroup from "./pages/EditGroup/EditGroup";

function App() {
  return (
    <AuthProvider>
      <ContactsProvider>
        <GroupsProvider>
          <Router>
            <Routes>
              <Route element={<PublicNav />}>
                <Route exact path="/" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
              </Route>
              <Route element={<Navbar />}>
                <Route element={<PrivateRoutes />}>
                  <Route path="/app" element={<ViewContacts />} />
                  <Route path="/app/account" element={<Account />} />
                  <Route path="/app/create-contact" element={<CreateContact />} />
                  <Route path="/app/contacts/:id" element={<ContactDetails />} />
                  <Route path="/app/edit-contact/:id" element={<EditContact />} />
                  <Route path="/app/favorites" element={<Favorites />} />
                  <Route path="/app/groups" element={<ViewGroups />} />
                  <Route path="/app/groups/create-group" element={<CreateGroup />} />
                  <Route path="/app/groups/:groupId" element={<GroupDetails />} />
                  <Route path="/app/groups/edit-group/:groupId" element={<EditGroup />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </GroupsProvider>
      </ContactsProvider>
    </AuthProvider>
  );
}

export default App;
