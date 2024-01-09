import express from "express"
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from "./admin.controller.js"
import { idVaildationSchema, validationUpdateUser, validationaAddUser } from "./admin.vaildation.js"
import { allowedTo } from "../../middleware/authorize.js"
import { validate } from "../../middleware/validate.js"
import { authenticate } from "../../middleware/authenticate.js"

const adminRouter = express.Router()

adminRouter.route('/')
    .post(authenticate, allowedTo('admin'), validate(validationaAddUser), addUser)
    .get(authenticate, allowedTo('admin'), getAllUsers)

adminRouter.route('/:id')
    .get(authenticate, allowedTo('admin'), validate(idVaildationSchema), getUser)
    .put(authenticate, allowedTo('admin'), validate(validationUpdateUser), updateUser)
    .delete(authenticate, allowedTo('admin'), validate(idVaildationSchema), deleteUser)

export default adminRouter
