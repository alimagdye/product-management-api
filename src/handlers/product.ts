import prisma from "../db";

// for get("/products") to get all products the signed-in user has.
export const getAllProducts = async function (req, res) {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user.id, // get all products that belong to the user in the request object
      },
    });

    res
      .status(200)
      .json({ message: "got all products successfully", data: products }); // send the products as a response to the client. if there are no products, it will return an empty array.
  } catch (error) {
    // if there is an error while getting the products from the database
    console.error("Error while getting products:", error.message);
    res.status(500).json({ message: "Error while getting products" });
    return;
  }
};

// for get("/products/:id") to get a product by its id, the signed-in user has.
export const getProductById = async function (req, res) {
  const productId = req.params.id; // get the id from the request parameters :id
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId, // find the product with the id of the request parameter
        userId: req.user.id, // and the user id of the request object. the req obj has the user returned from the protect middleware
      },
    });

    if (!product) {
      // if the product is not found
      res.status(400).json({ message: "Product not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "got the product successfully", data: product }); // send the product as a response to the client
  } catch (error) {
    // if there is an error while getting the product from the database
    console.error("Error while getting product:", error.message);
    res.status(500).json({ message: "Error while getting product" });
    return;
  }
};

// for post("/products") to create a product for the signed-in user.
export const createProduct = async function (req, res) {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name, // get the name from the request body
        description: req.body.description, // get the description from the request body
        price: req.body.price, // get the price from the request body
        userId: req.user.id, // get the user id from the request object
      },
    });

    res
      .status(201)
      .json({ message: "product created successfully", data: product }); // send the product as a response to the client
  } catch (error) {
    // if there is an error while creating the product in the database
    console.error("Error while creating product:", error.message);
    res.status(500).json({ message: "Error while creating product" });
    return;
  }
};

// for put("/products/:id") to update a product by its id, the signed-in user has.
export const updateProduct = async function (req, res) {
  const productId = req.params.id; // get the id from the request parameters :id
  const newData: Partial<{ name: string; description: string; price: number }> =
    {}; // declare a variable to store the data to be updated. partial is used to make all the properties optional
  if (req.body.name) newData.name = req.body.name; // if the name is provided in the request body, add it to the data object
  if (req.body.description) newData.description = req.body.description; // if the description is provided in the request body, add it to the data object
  if (req.body.price) newData.price = req.body.price; // if the price is provided in the request body, add it to the data object
  if (Object.keys(newData).length === 0) {
    // if there are no fields to update, because all fields are optional
    res.status(400).json({ message: "No fields provided for update" });
    return;
  }
  try {
    const product = await prisma.product.update({
      where: {
        id: productId, // find the product with the id of the request parameter
        userId: req.user.id, // and the user id of the request object. the req obj has the user returned from the protect middleware
      },
      data: newData, // update the product with the data object
    });
    res
      .status(201)
      .json({ message: "Product updated successfully", data: product }); // send a response to the client
  } catch (error) {
    if (error.code === "P2025") {
      // if any query error occurs in DB prisma throws P2025 error code
      res.status(400).json({ message: "error: product not found" });
      return;
    }

    console.error("Error while updating product:", error.message);
    res.status(500).json({ message: "error while updating product" });
    return;
  }
};

// for delete("/products/:id") to delete a product by its id, the signed-in user has.
export const deleteProduct = async function (req, res) {
  const productId = req.params.id; // get the id from the request parameters :id
  try {
    const product = await prisma.product.delete({
      where: {
        id: productId, // find the product with the id of the request parameter
        userId: req.user.id, // and the user id of the request object. the req obj has the user returned from the protect middleware
      },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res
      .status(201)
      .json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    if (error.code === "P2025") {
      // if any query error occurs in DB prisma throws P2025 error code
      res.status(400).json({ message: "error: product not found" });
      return;
    }

    console.error("Error while deleting product:", error.message); // if there is an error while deleting the product from the database
    res.status(500).json({ message: "Error while deleting product" });
    return;
  }
};
