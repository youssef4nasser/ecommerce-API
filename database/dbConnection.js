import mongoose from "mongoose"

export const dbConnection = ()=>{
    mongoose.connect(process.env.LOCAL_DB).then(()=>{
        console.log("db connected")
    }).catch((error)=>{
        console.log("database Erorr", error)
    })
}