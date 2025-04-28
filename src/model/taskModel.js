import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['To Do','In Progress','Done'],
        required: true
    },
})

export default mongoose.model("list", listSchema)