//conetcarnos con mongo
import mongoose from 'mongoose'
import 'dotenv/config'

const conectarDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err))
} 


export default conectarDB