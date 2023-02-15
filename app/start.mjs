import mongoose from "mongoose";
import dotenv from "dotenv";
import Debug from "../utils/Debug.mjs";
import { DB_URL, PORT } from "./env.mjs";
dotenv.config();

export default function start(app) {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(DB_URL)
    .then((res) =>
      app.listen(PORT, async () => {
        Debug.success("Server is running ...");
      })
    )
    .catch((err) => {
      Debug.error(err);
    });
}

// https://www.youtube.com/watch?v=KXhhpxt_OoI
