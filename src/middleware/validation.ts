import { validationResult } from "express-validator";

// 1. middleware are better for validation than making a function and calling it inside the handlers, because middleware works before the handler.

// 2. using express-validator is better than writting the validation logic from scratch, because it is a well-tested library that provides a lot of validation methods and returns standerd detailed error messages.

// middleware function that validates the name field in the request body.
// export const validateName = [
//   body("name").isString(),
//   (req, res, next) => {
//     // body("name").isString() is middleware that makes a validation on string.
//     const errors = validationResult(req); // then calls the next middleware which will validate the name field in the request body as a string.
//     if (!errors.isEmpty()) {
//       res.status(400).json({ message: errors.array() }); // if the validation fails, it will return an error response with a status code of 400 and an array of error messages.
//       return;
//     }

//     next(); // if the validation passes, it will call the next middleware or handler.
//   },
// ];

// middleware function that handles all input errors (validator)
export const handleInputErrors = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
    return;
  }

  next();
};
