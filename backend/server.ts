import Express from "express";
import mongoose from "mongoose";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
const app= Express();
const cors=require('cors');
const dotenv=require("dotenv");
dotenv.config();
app.use(cors());
app.use(Express.json());

mongoose.connect(process.env.DB_URL as string).then(()=>{
      console.log("MongoDB connected successfully");
}).catch((err)=>{
      console.log("MongoDB connection error",err);
})

app.use('/admin',adminRouter);
app.use('/user',userRouter);

app.listen(process.env.PORT,()=>{
      console.log(`Server is running on ${process.env.PORT}`);
})
