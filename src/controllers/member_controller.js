const connection = require("../database/connection");
const bcrypt = require("bcrypt");
const CardsController = require("./card_controller");

module.exports = {
  async index(request, response) {
    const members = await connection("members").select(
      "id",
      "username",
      "email",
      "cpf",
      "rg",
      "class_number",
      "gender",
      "phone_number",
      "birthdate"
    );

    const [count] = await connection("members").count();

    response.header("X-Total-Count", count["count(*)"]);

    return response.json(members);
  },
  async create(request, response) {
    const {
      username,
      email,
      password,
      cpf,
      rg,
      classNumber,
      gender,
      phoneNumber,
      birthdate,
    } = request.body;

    const passwordHash = bcrypt.hashSync(password, 10);
    try {
      const [id] = await connection("members")
        .insert({
          username: username,
          email: email,
          password: passwordHash,
          cpf: cpf,
          rg: rg,
          class_number: classNumber,
          gender: gender,
          phone_number: phoneNumber,
          birthdate: birthdate,
        })
        .returning("id");

      await CardsController.create(id);
    } catch (err) {
      if (err.constraint === "members_email_unique") {
        return response
          .status(422)
          .json({ error: "This email is already in use." });
      } else {
        return response
          .status(422)
          .json({ error: "An error occurred while registering. Try again." });
      }
    }

    return response
      .status(200)
      .json({ message: "User registered with success." });
  },
};
