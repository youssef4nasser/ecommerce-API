import express from "express"
import { addUser, changeUserPassword, deleteUser, getAllUsers, getUser, updateUser } from "./user.controller.js"
import { idVaildationSchema, validationUpdateUser, validationaAddUser, validationchangePassword } from "./user.vaildation.js"
import { allowedTo } from "../../middleware/authorize.js"
import { validate } from "../../middleware/validate.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"

const userRouter = express.Router()

userRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validate(validationaAddUser), addUser)
    .get(protectedRoutes, allowedTo('admin'), getAllUsers)

userRouter.route('/:id')
    .get(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), getUser)
    .put(protectedRoutes, allowedTo('admin'), validate(validationUpdateUser), updateUser)
    .delete(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), deleteUser)
    .patch(protectedRoutes, allowedTo('user'), validate(validationchangePassword), changeUserPassword)

export default userRouter
