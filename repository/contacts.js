import Contact from '../model/contact'

const listContacts = async () => {
  const contacts = await Contact.find()
  return contacts
}

const getContactById = async (contactId) => {
  const contactById = await Contact.findById(contactId)
  return contactById
}

const removeContact = async (contactId) => {
  const removeContact = await Contact.findByIdAndRemove(contactId)
  return removeContact
}

const addContact = async (body) => {
  const addContact = await Contact.create(body)
  return addContact
}

const updateContact = async (contactId, body) => {
  const updateContact = await Contact.findByIdAndUpdate(
    contactId,
    { ...body },
    {new: true},
  )
  return updateContact
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
