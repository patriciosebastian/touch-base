import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Account from '../../pages/Account/Account'
import CreateContact from '../../pages/CreateContact/CreateContact'
import ViewContacts from '../../pages/ViewContacts/ViewContacts'
import ContactDetails from '../../pages/ContactDetails/ContactDetails'
import EditContact from '../../pages/EditContact/EditContact'

export default function MainLayout() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/create-contact" element={<CreateContact />} />
        <Route path="/view-contacts" element={<ViewContacts />} />
        <Route path="/contacts/:id" element={<ContactDetails />} />
        <Route path="/edit-contact/:id" element={<EditContact />} /> {/* Should I make this a modal? */}
      </Routes>
    </>
  )
}
