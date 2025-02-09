import prisma from "../db";

// for get("/updates") to get all updates for all products the signed-in user has.
export const getAllUpdates = async function (req, res) {
  try {
    // get all updates that belong to the products that belong to the user in the request object
    const updates = await prisma.update.findMany({
      where: {
        productUpdated: {
          userId: req.user.id,
        },
      },
    });

    res
      .status(200)
      .json({ message: "got all updates successfully", data: updates });
  } catch (error) {
    console.error("Error while getting updates:", error.message);
    res.status(500).json({ message: "Error while getting updates" });
    return;
  }
};

// for get("/updates/:id") to get an update by its id, for product the signed-in user has.
export const getUpdateById = async function (req, res) {
  const updateId = req.params.id; // get the id from the request parameters :id
  try {
    // find the update with the id of the request parameter
    const update = await prisma.update.findUnique({
      where: {
        id: updateId, // find the update with the id of the request parameter
        productUpdated: {
          // and it's for a product that belongs to the user in the request object
          userId: req.user.id,
        },
      },
    });

    if (!update) {
      res.status(400).json({ message: "Update not found or unathorized" });
      return;
    }

    res
      .status(200)
      .json({ message: "got the update successfully", data: update });
  } catch (error) {
    console.error("Error while getting update:", error.message);
    res.status(500).json({ message: "Error while getting update" });
    return;
  }
};

// for post("/updates") to create an update for a product the signed-in user has.
export const createUpdate = async function (req, res) {
  try {
    const product = await prisma.product.findUnique({
      // find the product with the id of the request parameter
      where: { id: req.body.productUpdatedId },
    });

    if (!product || product.userId !== req.user.id) {
      // if the product doesn't exist or it doesn't belong to the user in the request object
      return res.status(403).json({
        message: "You don't own this product or product doesn't exist",
      });
    }

    const update = await prisma.update.create({
      // create an update
      data: {
        title: req.body.title, // get the title from the request body
        updateStatus: req.body.updateStatus || "IN_PROGRESS", // get the updateStatus from the request body
        body: req.body.body, // get the body from the request body
        version: req.body.version, // get the version from the request body
        assetUrl: req.body.assetUrl, // get the assetUrl from the request body
        productUpdatedId: req.body.productUpdatedId, // get the productUpdatedId from the request body
        description: req.body.description, // get the description from the request body
      },
    });

    res
      .status(201)
      .json({ message: "created the update successfully", data: update });
  } catch (error) {
    console.error("Error while creating update:", error.message);
    res.status(500).json({ message: "Error while creating update" });
    return;
  }
};

// for put("/updates/:id") to update an update by its id, for product the signed-in user has.
export const updateUpdateById = async function (req, res) {
  try {
    if (
      req.body.title ||
      req.body.updateStatus ||
      req.body.body ||
      req.body.version ||
      req.body.assetUrl ||
      req.body.description
    ) {
      const updatedUpdate = await prisma.update.update({
        where: {
          id: req.params.id, // find the update with the id of the request parameter
          productUpdated: {
            // and it's for a product that belongs to the user in the request object
            userId: req.user.id,
          },
        },
        data: {
          title: req.body.title, // get the title from the request body
          updateStatus: req.body.updateStatus, // get the updateStatus from the request body
          body: req.body.body, // get the body from the request body
          version: req.body.version, // get the version from the request body
          assetUrl: req.body.assetUrl, // get the assetUrl from the request body
          description: req.body.description, // get the description from the request body
        },
      });

      res.status(200).json({
        message: "updated the update successfully",
        data: updatedUpdate,
      });
    } else {
      res.status(400).json({ message: "No fields to update" });
    }
  } catch (error) {
    if (error.code === "P2025") {
      // if any query error occurs in DB prisma throws P2025 error code. this will happen because of user
      res
        .status(400)
        .json({ message: "error: update not found or unathorized" });
      return;
    }

    console.error("Error while updating update:", error.message);
    res.status(500).json({ message: "Error while updating update" });
    return;
  }
};

// for delete("/updates/:id") to delete an update by its id, for product the signed-in user has.
export const deleteUpdate = async function (req, res) {
  try {
    const deletedUpdate = await prisma.update.delete({
      where: {
        id: req.params.id, // find the update with the id of the request parameter
        productUpdated: {
          // and it's for a product that belongs to the user in the request object
          userId: req.user.id,
        },
      },
    });

    if (!deleteUpdate) {
      // if the update doesn't exist or it doesn't belong to the user in the request object
      res.status(404).json({ message: "update not found or unathorized" });
      return;
    }

    res.status(200).json({
      message: "deleted the update successfully",
      data: deletedUpdate,
    });
  } catch (error) {
    if (error.code === "P2025") {
      // if any query error occurs in DB prisma throws P2025 error code. this will happen because of user
      res
        .status(400)
        .json({ message: "error: update not found or unathorized" });
      return;
    }

    console.error("Error while deleting update:", error.message);
    res.status(500).json({ message: "Error while deleting update" });
    return;
  }
};
