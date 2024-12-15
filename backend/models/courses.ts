import mongoose from "mongoose";
import { number } from "zod";

const courseSchema=new mongoose.Schema({
      title:{
            type:String,
            require:true,
      },
      description:{
            type:String,
            required:true,
      },
      duration:{
            type:Number,
            required:true,
      },
      instructor:{
            type:String,
            required:true,
      }
})
      
export default mongoose.model('Course',courseSchema);