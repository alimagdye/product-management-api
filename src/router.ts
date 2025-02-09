import { Router } from "express";
import { handleInputErrors } from "./middleware/validation";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getAllUpdates,
  getUpdateById,
  updateUpdateById,
} from "./handlers/update";

const router = Router(); // create a router: a sub-app of express app

// router.method(path, routeHandler)

// for products collection:
// the convention is to use plural form for collection names and kebab-case for multi-word collection names in paths
router.get("/products", getAllProducts); // get all products

// get a product by id
router.get(
  "/products/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("product id is required")
      .isUUID()
      .withMessage("Invalid product id format"), // Validate id in URL
  ],
  handleInputErrors,
  getProductById
);

// create a product (add a product to the collection)
router.post(
  "/products",
  [
    body("name")
      .isString()
      .isLength({ max: 254 })
      .withMessage("name must be a string with length less than 255"), // validate the name of product in the request body as a string
    body("description").isString().withMessage("description must be a string"), // validate the description of product in the request body as a string
    body("price").isFloat().withMessage("price must be a valid number"), // validate the price of product in the request body as a float
  ],
  handleInputErrors,
  createProduct
);

// update a product by id
router.put(
  "/products/:id",

  [
    body("name")
      .optional()
      .isString()
      .isLength({ max: 254 })
      .withMessage("name must be a string with length less than 255"), // validate the name of product in the request body as a string
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"), // validate the description of product in the request body as a string
    body("price")
      .optional()
      .isFloat()
      .withMessage("price must be a valid number"), // validate the price of product in the request body as a float
    param("id")
      .notEmpty()
      .withMessage("product id is required")
      .isUUID()
      .withMessage("Invalid product id format"), // Validate id in URL
  ],
  handleInputErrors,
  updateProduct
);

// delete a product by id
router.delete(
  "/products/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("product id is required")
      .isUUID()
      .withMessage("Invalid product id format"),
  ],
  handleInputErrors,
  deleteProduct
);

// for updates:
router.get("/updates", getAllUpdates); // get all updates for all products the signed-in user has

// get an update by id for product the signed-in user has
router.get(
  "/updates/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("update id is required")
      .isUUID()
      .withMessage("Invalid update id format"), // Validate id in URL
  ],
  handleInputErrors,
  getUpdateById
);

// create an update (add an update to the collection) for a product the signed-in user has
router.post(
  "/updates",
  [
    body("title")
      .isString()
      .isLength({ max: 254 })
      .withMessage("title must be a string with length less than 255"), // validate the title of update in the request body as a string
    body("updateStatus")
      .optional() // Allows request without updateStatus (DB will set default)
      .isIn(["IN_PROGRESS", "PENDING", "DONE"])
      .withMessage("updateStatus must be one of IN_PROGRESS, PENDING, DONE"), // validate the updateStatus of update in the request body as one of the values in the array
    body("body").isString().withMessage("body must be a string"), // validate the body of update in the request body as a string
    body("description").isString().withMessage("description must be a string"), // validate the description of update in the request body as a string
    body("version").isString().withMessage("version must be a string"), // validate the version of update in the request body as a string
    body("assetUrl")
      .optional() // Allows it to be missing
      .isString()
      .withMessage("assetUrl must be a string"), // validate the assetUrl of update in the request body as a string
    body("productUpdatedId")
      .notEmpty()
      .withMessage("productUpdatedId is required")
      .isUUID() // Adjust this if it's not a UUID
      .withMessage("Invalid productUpdatedId format"), // validate the productUpdatedId of update in the request body as a UUID
  ],
  handleInputErrors,
  createUpdate
);

// update an update by id
router.put(
  "/updates/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("update id is required")
      .isUUID()
      .withMessage("Invalid update id format"), // Validate id in URL
    body("title")
      .optional()
      .isString()
      .isLength({ max: 254 })
      .withMessage("title must be a string with length less than 255"), // validate the title of update in the request body as a string
    body("updateStatus")
      .optional() // Allows request without updateStatus (DB will set default)
      .isIn(["IN_PROGRESS", "PENDING", "DONE"])
      .withMessage("updateStatus must be one of IN_PROGRESS, PENDING, DONE"), // validate the updateStatus of update in the request body as one of the values in the array
    body("body").optional().isString().withMessage("body must be a string"), // validate the body of update in the request body as a string
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"), // validate the description of update in the request body as a string
    body("version")
      .optional()
      .isString()
      .withMessage("version must be a string"), // validate the version of update in the request body as a string
    body("assetUrl")
      .optional() // Allows it to be missing
      .isString()
      .withMessage("assetUrl must be a string"), // validate the assetUrl of update in the request body as a string
  ],
  handleInputErrors,
  updateUpdateById
);

// delete an update by id
router.delete(
  "/updates/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("product id is required")
      .isUUID()
      .withMessage("Invalid product id format"),
  ],
  handleInputErrors,
  deleteUpdate
);

export default router;
