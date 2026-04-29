import {connect} from 'mongoose'

const dbConnect = async (link) => { 
  try {
    await connect(link)
    console.log("MongoDB connected. . .")
  } catch (error) {
    console.error(`MongoDB cannot connect: ${error.message}`)
    process.exit(1)
  }
}
export default dbConnect