import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContactsProvider } from "./context/ContactsContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home/Home";
import SignIn from "./auth/SignIn/SignIn";
import SignUp from "./auth/SignUp/SignUp";
import PrivateRoutes from "./auth/PrivateRoutes";
import MainLayout from "./components/MainLayout/MainLayout";

function App() {
  return (
    <AuthProvider>
      <ContactsProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/*" element={
              <PrivateRoutes>
                <MainLayout />
              </PrivateRoutes>}>
            </Route>
          </Routes>
        </Router>
      </ContactsProvider>
    </AuthProvider>
  );
}

export default App;
