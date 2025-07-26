// creating product
import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProductRequest = async (req, res) => {
    const { name, pricePerUnit, availableQuantity, image, category, isOutFoStock } = req.body;
    const supplierId = req.user._id;
    if (!supplierId) {
        res.status(401).json("Unauthorized");
        throw new Error("Unauthorized");
    }
    if (!name || !pricePerUnit || !availableQuantity || !image || !category || !isOutFoStock) {
        res.status(400).json("All fields are required");
        throw new Error("All fields are required");
    }
    if (isOutFoStock) {
        res.status(400).json("Product is out of stock");
        throw new Error("Product is out of stock");
    }

    // attachment in multer
    const attachmentFile = req.files?.attachments[0]?.path;
    if (!attachmentFile) {
        res.status(400).json("Attachment is required");
        throw new Error("Attachment is required");
    }

    // upload on cloudinary
    const uploadedResponse = await uploadOnCloudinary(attachmentFile);
    if (!uploadedResponse) {
        res.status(400).json("Attachment is required");
        throw new Error("Attachment is required");
    }


    const product = await Product.create({
        supplierId,
        name,
        pricePerUnit,
        availableQuantity,
        image,
        category,
        isOutFoStock,
        attachments,
    });

    res.status(201).json(product, "Product created successfully");
}

export { createProductRequest };