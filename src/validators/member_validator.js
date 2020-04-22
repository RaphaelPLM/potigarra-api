const { celebrate, Segments, Joi } = require("celebrate");

const ExtendedJoi = Joi.extend(require("@hapi/joi-date"));

module.exports = {
  validateCreate:
    celebrate({
      [Segments.BODY]: ExtendedJoi.object().keys({
        username: ExtendedJoi.string().required(),
        email: ExtendedJoi.string().required().email(),
        password: ExtendedJoi.string().required(),
        passwordConfirmation: ExtendedJoi.string().required(),
        cpf: ExtendedJoi.string().required().length(14),
        rg: ExtendedJoi.string().required(),
        classNumber: ExtendedJoi.number().required(),
        gender: ExtendedJoi.string().valid("Masculino", "Feminino"),
        phoneNumber: ExtendedJoi.string().required(),
        birthdate: ExtendedJoi.date().format("DD/MM/YYYY").raw().required(),
      }),
    })
};
