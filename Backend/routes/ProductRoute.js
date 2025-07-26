import express from "express";
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';
import { createProductRequest, isOutFoStock ,updateProductMedia} from '../controllers/product.Controller.js';
import { upload } from '../middleware/uploadMiddleware.js';

const ProductRouter = express.Router();

router.route('/create-product').post(protect, upload.fields([{
    name: 'image',
}, {
    name: 'attachments',
    
}]), asyncHandler(createProductRequest));

router.route('/is-out-of-stock').post(protect, asyncHandler(isOutFoStock));

router.route('/update-product-media').post(protect, upload.fields([{
    name: 'image',
}, {
    name: 'attachments',
    
}]), asyncHandler(updateProductMedia));


export default ProductRouter;