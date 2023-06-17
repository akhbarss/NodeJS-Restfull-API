import express from "express";
import { publicRouter } from "../routes/publlic-api";
import { userRouter } from "../routes/api";
import { errorMiddleware } from "../middleware/error-middleware";
import cors from "cors";

export const app = express();

app.use(express.json());

app.use(cors());

app.use(publicRouter);
app.use(userRouter);
app.use(errorMiddleware);
