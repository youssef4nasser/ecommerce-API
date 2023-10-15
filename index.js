import express from 'express'
import { bootstrap } from './src/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors'
import { createOnlineOrder } from './src/modules/order/order.controller.js'
dotenv.config()

const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.post('/webhook', express.raw({type: 'application/json'}), createOnlineOrder);

app.use(express.json()) 

bootstrap(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
