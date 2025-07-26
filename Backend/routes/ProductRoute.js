import express from "express";
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';
import { createProductRequest } from '../controllers/product.Controller.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post("/create-product-request", protect, upload.array('attachments'), asyncHandler(createProductRequest));

export default router;