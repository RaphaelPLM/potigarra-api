const connection = require("../database/connection");
const axios = require("axios");

function formatDate(unformattedDate) {
  const date = new Date(unformattedDate);

  return date.toLocaleDateString("en-GB");
}

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

    return response.status(200).json(cards);
  },

  async create(id) {
    const data = await connection("cards").insert({
      member_id: id,
    });

    console.log("Created card for member", id);
  },

  async generatePass(request, response) {
    const { memberId } = request.body;

    // Get data of the member whose card will be activated
    const memberData = await connection("members")
      .select("username", "birthdate", "created_at")
      .where("id", memberId)
      .first();

    const name = memberData.username;
    const createdAt = formatDate(memberData.created_at);
    const expirationDate = "01/01/2021";

    const apiURL = process.env.PASSSLOT_URL;

    const config = {
      headers: {
        Authorization: process.env.PASSSLOT_KEY,
      },
    };

    try {
      const apiResponse = await axios.post(
        apiURL,
        { nome: name, createdAt: createdAt, expirationDate: expirationDate },
        config
      );

      await connection("cards").where("member_id", memberId).update({
        url: apiResponse.data.url,
        status: "Active",
        serial_number: apiResponse.data.serialNumber
      });
    } catch (err) {
      console.log(
        "An error has occurred while generating pass for member",
        memberId
      );

      return response
        .status(500)
        .json({ error: "An error has occured. Try again." });
    }

    return response.status(200).json({message: "Your card was successfully generated."})
  },
};
