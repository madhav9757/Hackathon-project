import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createProductRequest = async (req, res) => {
  try {
    const { name, pricePerUnit, availableQuantity, category, isOutFoStock } = req.body;
    const supplierId = req.user?._id;

    // Authorization check
    if (!supplierId) {
      throw new ApiError(401, "Unauthorized");
    }

    // Validate required fields
    if (!name || !pricePerUnit || !availableQuantity || !category || isOutFoStock === undefined) {
      throw new ApiError(400, "All fields are required");
    }

    // Validate images
    if (!req.files || !Array.isArray(req.files.image) || req.files.image.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    // Upload images
    const imageUploadPromises = req.files.image.map(file =>
      uploadOnCloudinary(file.path)
    );

    // Upload attachments if any
    const attachmentUploadPromises = Array.isArray(req.files.attachments)
      ? req.files.attachments.map(file => uploadOnCloudinary(file.path))
      : [];

    // Upload all files
    const [uploadedImages, uploadedAttachments] = await Promise.all([
      Promise.all(imageUploadPromises),
      Promise.all(attachmentUploadPromises)
    ]);

    // Extract URLs
    const imageURLs = uploadedImages.map(file => file.secure_url);
    const attachmentURLs = uploadedAttachments.map(file => file.secure_url);

    // Create product
    const product = await Product.create({
      supplierId,
      name,
      pricePerUnit,
      availableQuantity,
      image: imageURLs,
      category,
      isOutFoStock,
      attachments: attachmentURLs
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));

  } catch (error) {
    console.error("Product creation error:", error);
    const status = error.statusCode || 500;
    res.status(status).json(new ApiError(status, error.message || "Server Error"));
  }
};

const isOutFoStock = async (req, res) => {
  const { isOutFoStock } = req.body;
  const product = await Product.findById(req.user.id);
  if (!product) {
    return res.status(404).json("Product not found");
  }
  product.isOutFoStock = isOutFoStock;
  await product.save();
  res.status(200).json(new ApiResponse(200, {}, "product update successfully"));
};

const updateProductMedia = async (req, res) => {
  try {
    const { productId, deleteImageUrls = [], deleteAttachmentUrls = [] } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Ensure ownership
    if (product.supplierId.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: Not your product");
    }

    // ===== Step 1: Handle deletions =====
    const updatedImages = product.image.filter(
      url => !deleteImageUrls.includes(url)
    );
    const updatedAttachments = product.attachments.filter(
      url => !deleteAttachmentUrls.includes(url)
    );

    // ===== Step 2: Handle new uploads =====
    const newImageUploads = req.files.image || [];
    const newAttachmentUploads = req.files.attachments || [];

    // Optional: Enforce max limit (e.g., max 5 images)
    const MAX_IMAGES = 5;
    const MAX_ATTACHMENTS = 10;

    if (updatedImages.length + newImageUploads.length > MAX_IMAGES) {
      throw new ApiError(400, `Max ${MAX_IMAGES} images allowed`);
    }
    if (updatedAttachments.length + newAttachmentUploads.length > MAX_ATTACHMENTS) {
      throw new ApiError(400, `Max ${MAX_ATTACHMENTS} attachments allowed`);
    }

    // Upload new images
    const uploadedImageResults = await Promise.all(
      newImageUploads.map(file => uploadOnCloudinary(file.path))
    );
    const newImageURLs = uploadedImageResults.map(f => f.secure_url);

    // Upload new attachments
    const uploadedAttachmentResults = await Promise.all(
      newAttachmentUploads.map(file => uploadOnCloudinary(file.path))
    );
    const newAttachmentURLs = uploadedAttachmentResults.map(f => f.secure_url);

    // ===== Step 3: Save merged result =====
    product.image = [...updatedImages, ...newImageURLs];
    product.attachments = [...updatedAttachments, ...newAttachmentURLs];

    await product.save();

    res.status(200).json(
      new ApiResponse(200, product, "Product media updated successfully")
    );
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json(new ApiError(status, error.message || "Server Error"));
  }
};


export { createProductRequest, isOutFoStock, updateProductMedia };
