import express from "express";
import router from "./router";
import { protect } from "./modules/auth";
import { createUser, loginUser } from "./handlers/user";
import { handleInputErrors } from "./middleware/validation";
import { errorHandler, globalMiddleware } from "./middleware/globalMiddleware";
import { body } from "express-validator";
const PORT = process.env.PORT || 3000; // set the port for the server to listen on

const app = express(); // create express app

app.use(globalMiddleware); // use global middleware in the app

// app.method(path, routeHandler)
app.post(
  "/signup",
  [
    body("username").isString().withMessage("name must be a string"),
    body("email").isEmail().withMessage("email must be a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters long"),
  ],
  handleInputErrors,
  createUser
); // create a user and save it to the database and return a JWT token

app.post(
  "/login",
  [
    body("username").isString().withMessage("name must be a string"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters long"),
  ],
  handleInputErrors,
  loginUser
); // login a user and return a JWT token

app.use("/api", protect, router); // mount router components in the path: 'api' of the app, e.g., '/api/products', '/api/updates', '/api/update-points'. The protect middleware is used to check if the request is authorized to access the routes.

app.use(errorHandler); // use error handler middleware in the app

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
}); // start the server on the specified port
