import express from 'express'
import { getContacts, getContactById, addContact, removeContact, updateContact } from '../../../controllers/contacts'
import { validateAddContact, validateUpdate, validateUpdateFavorite, validateId } from './validation'

const router = express.Router()


router.get('/', getContacts)

router.get('/:id', validateId, getContactById)

router.post('/', validateAddContact, addContact)

router.delete('/:id', validateId, removeContact)

router.put('/:id', validateId, validateUpdate, updateContact)

router.patch('/:id/favorite', validateId, validateUpdateFavorite, updateContact)

export default router
