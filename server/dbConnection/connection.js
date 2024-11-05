const mongoose = require('mongoose')

const DB_URL=`${process.env.MONGO_URI}/${process.env.DB_Name}`

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(DB_URL);
        console.log(`MongoDB Connected:${conn.connection.host}`);
        
    }catch(error){
        console.log(`Error while connecting to DB,${error}`)
        process.exit(1)
    }
}

module.exports = connectDB;