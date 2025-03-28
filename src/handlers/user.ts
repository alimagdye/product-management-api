import prisma from "../db";
import {
  createJWTtoken,
  hashPassword,
  comparePasswords,
} from "../modules/auth";

// handler function to create a user and save it to the database (signup)
export const createUser = async function (req, res) {
  const { username, email, password } = req.body; // get the username, email, and password from the request body
  let user;
  try {
    user = await prisma.user.create({
      // create a user in the database using the prisma client, which will get converted to a SQL query. The user object is returned from the database after creation.
      data: {
        // data to be saved in the database
        username, // username: username
        email,
        password: await hashPassword(password), // hash the password before saving it to the database
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // if unique constrain error or any query error occurs in DB prisma throws P2002 error code
      console.error("Error Username or email already exists:", error.message);
      res.status(400).json({ message: "Username or email already exists" }); // status code 400 for bad request from the client
      return;
    }

    // else:
    console.error("Error while creating user:", error.message);
    res.status(400).json({ message: "User creation failed" }); // send a response to the client
    return;
  }

  // if the user is created successfully:
  const token = createJWTtoken(user); // create a JWT token for the user

  res.status(201).json({
    message: "sign up successful",
    user: { id: user.id, username: user.username, email: user.email },
    token,
  }); // send a response with the JWT token to the client, 201 status code for successful creation (post request)
};

// handler function to login a user and return a JWT token (signin)
export const loginUser = async function (req, res) {
  const { username, password } = req.body; // get the username and password from the request body
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username, // find a user with the username
      },
    });
  } catch (error) {
    // if an error occurs while finding the user in the database
    console.error("Error in database connection:", error.message);
    res.status(500).json({ message: "DB connection error" }); // send a response to the client, 500 status code for internal server error
    return;
  }

  // if the user is found or not found:
  const dummyHash = "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash"; // dummy hash to prevent timing attacks
  const isPasswordCorrect = user
    ? await comparePasswords(password, user.password) // compare the password from the request with the password from the database
    : await comparePasswords(password, dummyHash); // compare the password with a dummy hash to prevent timing attacks. if I returned false quickly the attacker can know the password is incorrect but the username is correct
  if (!isPasswordCorrect) {
    // if the password is incorrect
    console.error("Incorrect password or username");
    res.status(401).json({ message: "Incorrect password or username" }); // send a response to the client, 401 status code for unauthorized request
    return;
  }

  // if the password is correct:
  const token = createJWTtoken(user); // create a JWT token for the user
  res.status(200).json({
    message: "login successful",
    user: { id: user.id, username: user.username },
    token,
  }); // send a response with the JWT token to the client, 200 status code for successful request
};
