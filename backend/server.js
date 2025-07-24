import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectToDatabase from "./config/db.js";
import "./cronJobs/candidateDataCleanup.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"

const app = express();
connectToDatabase();

dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/hr", recruiterRoutes);
app.use("/api/file",fileRoutes)

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Hello I'm server responding with 200 status achieved",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on Port http://localhost:${PORT}`);
});
