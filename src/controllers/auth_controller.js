require("dotenv").config({ path: "./.env" });

const connection = require("../database/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function getUserFromEmail(email) {
  console.log("Authenticating...");

  const data = await connection("members")
    .select("id", "password")
    .where("email", email)
    .first();

  // In case the user is invalid, data will be undefined.
  if (data == undefined) {
    return undefined;
  }

  return { id: data.id, password: data.password };
}

module.exports = {
  async login(request, response) {
    console.log("Started [POST] /login");

    const errorMessage =
      "The authentication failed. The credentials provided are invalid.";

    const { email, password } = request.body;

    console.log("Received JSON params:", request.body);

    const user = await getUserFromEmail(email);

    if (user == undefined) {
      console.log("[ERROR]", errorMessage);

      return response.status(401).json({ error: errorMessage });
    }

    const userId = user.id;
    const passwordHash = user.password;

    if (!bcrypt.compareSync(password, passwordHash)) {
      console.log("[ERROR]", errorMessage);

      return response.status(401).json({ error: errorMessage });
    }

    jwt.sign(
      { user: { id: userId, email } },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: parseInt(process.env.TOKEN_EXPIRATION_TIME) },
      (error, token) => {
        const successMessage =
          "The credentials provided are valid. Succesfully logged in.";

        console.log("[SUCCESS]", successMessage);

        return response
          .status(200)
          .json({ token: token, message: successMessage });
      }
    );
  },
};
