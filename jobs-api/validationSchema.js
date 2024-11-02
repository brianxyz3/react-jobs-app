import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const jobSchema = Joi.object({
  type: Joi.string().required().escapeHTML(),
  title: Joi.string().required().escapeHTML(),
  location: Joi.string().required().escapeHTML(),
  description: Joi.string().escapeHTML(),
  salary: Joi.string().required().escapeHTML(),
  company: {
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().escapeHTML(),
  },
  conatact: {
    email: Joi.string().required().escapeHTML(),
    phone: Joi.string().escapeHTML(),
  },
}).required();

export default jobSchema;
