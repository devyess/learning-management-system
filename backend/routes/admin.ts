import express, { Request, Response } from 'express';
import Course from '../models/courses';
import {z} from "zod";
import mongoose from "mongoose";
const adminRouter = express.Router();

const courseValidation=z.object({
      title:z.string().min(3),
      description:z.string().min(10),
      duration:z.number().min(1),
      instructor:z.string().min(3)
});

adminRouter.post('/courses', async (req: Request, res: Response): Promise<void> => {

      const validation=courseValidation.safeParse(req.body);
      if(!validation.success){
            res.status(400).json({
                  message:"Input correct Inputs",
                  errors:validation.error.errors.map((error)=>({
                        path:error.path,
                        message:error.message
                  })),
            });
            return;
      }

      try{
            const{title,description,duration,instructor}=validation.data;
            const course=new Course({
                  title,
                  description,
                  duration,
                  instructor
            });
            await course.save();
            res.status(200).json({
                  message:"Course Added Successfully"
            });

      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
});

const updateValidator=z.object({
      title:z.string().min(3).optional(),
      description:z.string().min(3).optional(),
      duration:z.number().min(1).optional(),
      instructor:z.string().min(3).optional()
})

//This router will be used to update the course
adminRouter.put('/courses/:id', async(req: Request, res: Response): Promise<void> => {
      try{
            const new_id=new mongoose.Types.ObjectId(req.params.id);
            const course= await Course.findOne({
                  _id:new_id
            })
            const validate=updateValidator.safeParse(req.body);
            if(!course){
                  res.status(400).json({
                        message:"Course do not exist"
                  })
                  return;
            }
            if(!validate.success){
                  res.status(400).json({
                        message:"Incorrect Inputs",
                        errors:validate.error.errors.map((err)=>({
                              path:err.path,
                              message:err.message
                        }))
                  });
                  return;
            }
            const updatedFields = {} as any;
            if (validate.data.title) updatedFields.title = validate.data.title;
            if (validate.data.description) updatedFields.description = validate.data.description;
            if (validate.data.duration) updatedFields.duration = validate.data.duration;
            if (validate.data.instructor) updatedFields.instructor = validate.data.instructor;
        
            await Course.updateOne({ _id: new_id }, { $set: updatedFields });
            res.status(200).json({
                  message:"Course Updated Successfully"
            })
            
      }catch(err){
            console.log(err);
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
});

adminRouter.delete('/courses/:id', async(req: Request, res: Response): Promise<void> => {
      try{
            const new_id=new mongoose.Types.ObjectId(req.params.id);
            const course= await Course.findOne({
                  _id:new_id
            })
            if(!course){
                  res.status(400).json({
                        message:"Course do not exist"
                  })
                  return;
            }
            await Course.deleteOne({_id:new_id});
            res.status(200).json({
                  message:"Course Deleted Successfully"
            })
            
      }catch(err){
            res.status(500).json({
                  message:"Internal Server Error"
            })
      }
});

export default adminRouter;