import express, { Request, Response } from 'express';
import Course from '../models/courses';
import User from '../models/users';
import mongoose from 'mongoose';
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const userRouter = express.Router();

userRouter.post('/signup', async(req: Request, res: Response): Promise<void> => {
      try{
            const {name, email, password}=req.body;
            const user = await User.findOne({email});
            if(user){
                  res.status(400).json({
                        message:"User already exists"
                  })
            }
            const genSalt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password, genSalt);
            const newUser=new User({name, email, password:hashedPassword});
            newUser.save();
            res.status(200).json({
                  message:"User Created Successfully",
                  user:newUser
            })
      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
      
});

userRouter.post('/login',async(req:Request,res:Response):Promise<void>=>{
      try{
            const {email, password}=req.body;
            const user=await User.findOne({email});
            if(!user){
                  res.status(400).json({
                        message:"User not found"
                  })
                  return;
            }
            const isMatch=await bcrypt.compare(password, user.password);
            if(!isMatch){
                  res.status(400).json({
                        message:"Invalid Password"
                  })
                  return;
            }
            const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
            res.status(200).json({
                  message:"Login Successfully",
                  token:token
            })
      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
})

userRouter.get('/courses', async(req: Request, res: Response): Promise<void> => {
      try{
            const courses=await Course.find()
            res.status(200).json({
                  message:"Courses Fetched Successfully",
                  courses:courses
            })
      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
});

userRouter.post('enroll/:courseId', async (req: Request, res: Response): Promise<void> => {
      try{
            const new_id = new mongoose.Types.ObjectId(req.params.courseId);
            const course = await Course.findById(new_id);
            if(!course){
                  res.status(400).json({
                        message:"Course do not exist"
                  })
                  return;
            }
            const user = await User.findById(req.body.userId);
            if (!user) {
                  res.status(404).json({ message: "User not found" });
                  return;
            }
            await User.updateOne(
                  { _id: user._id },
                  { $addToSet: { enrolledCourses: new_id } }
                );
            res.status(200).json({
                  message:"Enrolled Successfully"
            })

      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
});

export default userRouter;