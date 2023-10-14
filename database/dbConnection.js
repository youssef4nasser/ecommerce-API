import mongoose from "mongoose"

export const dbConnection = ()=>{
    mongoose.connect(process.env.DB_ONLINE).then(()=>{
        console.log("db connected")
    }).catch((error)=>{
        console.log("database Erorr", error)
    })
}