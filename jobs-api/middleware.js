import validator from "validator";
import ExpressError from "./utilities/ExpressError.js";
import Job from "./model/job.js";

const sanitizeJob = (req, res, next) => {
  try {
    const job = req.body;
    job.title = validator.escape(req.body.title);
    job.description = validator.escape(req.body.description);
    job.location = validator.escape(req.body.location);
    job.company.name = validator.escape(req.body.company.name);
    job.company.description = validator.escape(req.body.company.description);
    job.contact.email = validator.normalizeEmail(req.body.contact.email);
    job.contact.phone = validator.escape(req.body.contact.phone);
    next();
  } catch (err) {
    throw new ExpressError(400, err);
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.body.token) {
    return next();
  }
  throw new ExpressError(401, "Unknown User, Please Login");
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  const job = await Job.findById(id);
  if (job.author.equals(userId)) return next();
  return res.json("Unauthorized User");
};

export { sanitizeJob, isLoggedIn, isAuthor };
