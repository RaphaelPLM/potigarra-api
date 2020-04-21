const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    const cards = await connection("cards")
      .join("members", "members.id", "=", "cards.member_id")
      .select(
        "*",
        "members.username",
        "members.cpf",
        "members.rg",
        "members.phone_number",
        "members.class_number",
        "members.gender",
        "members.birthdate",
        "members.created_at"
      );

    const [count] = await connection("cards").count();

    response.header("X-Total-Count", count["count(*)"]);

    return response.json(cards);
  },

  async create(id) {
    const data = await connection("cards").insert({
      member_id: id,
    });

    console.log("Created card for member", id);
  },
};
