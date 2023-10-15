import express from 'express'
import { bootstrap } from './src/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.use(express.json())

app.use("/", (req, res,)=>{
    console.log("Welcome")
})

bootstrap(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
