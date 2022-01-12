import Contact from '../model/contact'

const listContacts = async (userId) => {
  const contacts = await Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email',
  })
  return contacts
}

const getContactById = async (userId, contactId) => {
  const contactById = await Contact.findOne({_id: contactId, owner: userId})
  return contactById
}

const removeContact = async (userId, contactId) => {
  const removeContact = await Contact.findOneAndRemove({_id: contactId, owner: userId})
  return removeContact
}

const addContact = async (userId, body) => {
  const addContact = await Contact.create({...body, owner: userId})
  return addContact
}

const updateContact = async (userId, contactId, body) => {
  const updateContact = await Contact.findOneAndUpdate(
    {_id: contactId, owner: userId},
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
