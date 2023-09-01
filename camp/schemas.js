const Joi = require('joi');
const { number } = require('joi');

module.exports.campgroundSchema = Joi.object({
    site: Joi.object({
        name: Joi.string().required(),
        // photoUrl: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
    }).required()
});
