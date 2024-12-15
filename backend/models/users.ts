import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
      userId:{
            type:String,
            required:true,
      },
      enrolledCourses:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
      }],
})

export default mongoose.model('User',userSchema);