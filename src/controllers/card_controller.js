const connection = require("../database/connection");
const axios = require("axios");
var format = require("date-fns/format");

module.exports = {
  async index(request, response) {
    const cards = await connection("cards")
      .join("members", "members.id", "=", "cards.member_id")
      .select(
        "cards.*",
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
    try {
      const data = await connection("cards").insert({
        member_id: id,
      });

      console.log("Created card for member", id, "\n", data, "\n");
    } catch (err) {
      console.log("An error occurred when creating a card for member", id);
    }
  },

  async generatePass(request, response) {
    const { memberId } = request.body;

    console.log("Generating pass for member of ID", memberId);

    // Get data of the member whose card will be activated
    const memberData = await connection("members")
      .select("username", "birthdate", "created_at")
      .where("id", memberId)
      .first();

    const name = memberData.username;
    const createdAt = format(memberData.created_at, "dd/MM/yyyy");
    const expirationDate = "01/01/2021";

    console.log({ name, createdAt, expirationDate });

    const apiURL = process.env.PASSSLOT_URL;

    const config = {
      headers: {
        Authorization: process.env.PASSSLOT_KEY,
      },
    };

    var updatedCard = [];

    try {
      const apiResponse = await axios.post(
        apiURL,
        { nome: name, createdAt: createdAt, expirationDate: expirationDate },
        config
      );

      console.log(
        "Pass successfully generated.\n",
        apiResponse,
        "\nStoring pass data in database..."
      );

      await connection("cards").where("member_id", memberId).update({
        url: apiResponse.data.url,
        status: "Active",
        serial_number: apiResponse.data.serialNumber,
      });

      updatedCard = await connection("cards")
        .select("*")
        .where({ member_id: memberId })
        .first();

      console.log("Successfully stored pass data in database\n", updatedCard);
    } catch (err) {
      console.log(
        "An error has occurred while generating pass for member",
        memberId
      );

      return response
        .status(500)
        .json({ error: "An error has occured. Try again." });
    }

    return response.status(200).json({
      card: updatedCard,
      message: "Your card was successfully generated.",
    });
  },
};
