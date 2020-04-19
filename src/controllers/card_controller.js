const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    const cards = await connection("cards").select(
      "id",
      "url",
      "status",
      "member_id"
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
