import express, { Request, Response } from 'express';
import Course from '../models/courses';
const userRouter = express.Router();

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

userRouter.post('enroll/:courseId', (req: Request, res: Response): void => {
      
});

export default userRouter;