import express from 'express'
import { getContacts, getContactById, addContact, removeContact, updateContact } from '../../../controllers/contacts'
import { validateAddContact, validateUpdate, validateUpdateFavorite, validateId } from './validation'
import guard from '../../../middlewares/guard'

const router = express.Router()


router.get('/', guard, getContacts)

router.get('/:id', guard, validateId, getContactById)

router.post('/', guard, validateAddContact, addContact)

router.delete('/:id', guard, validateId, removeContact)

router.put('/:id', guard, validateId, validateUpdate, updateContact)

router.patch('/:id/favorite', guard, validateId, validateUpdateFavorite, updateContact)

export default router
