import express from 'express'
import { bootstrap } from './src/bootstrap.js'
import { dbConnection } from './database/dbConnection.js'
import dotenv from 'dotenv'
import morgan from 'morgan'
const app = express()
const port = 5000
app.use(express.json())
app.use(morgan('dev'))
dotenv.config()
dbConnection()
bootstrap(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

