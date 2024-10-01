import express from "express";
import cors from "cors";
import indexRouter from "./index.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: 'http://localhost:3000' 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use("/", indexRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
