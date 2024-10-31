import jobSchema from "./validationSchema.js";
import ExpressError from "./utilities/ExpressError.js";

const validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

export default validateJob;
