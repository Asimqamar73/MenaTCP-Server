import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createConnection,
  getConnections,
  getConnectionById,
  acceptConnection,
  getConfirmedConnections,
  deleteConnection,
} from "../controllers/connections.js";

const router = express.Router();
router.post("/create-connection", auth, createConnection);
router.get("/get-connections/:id", auth, getConnections);
router.get("/get-connection-by-id", auth, getConnectionById);
router.get("/get-Confirmed-Connections", auth, getConfirmedConnections);
router.patch("/accept-connection", auth, acceptConnection);
router.delete("/delete-connection/:id", auth, deleteConnection);

export default router;
