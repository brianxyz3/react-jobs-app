import validator from "validator";
import ExpressError from "./utilities/ExpressError.js";
import Job from "./model/job.js";

const sanitizeJob = (req, res, next) => {
  try {
    console.log("Got into sanitize middleware");

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
  console.log("got into authentication middleware");

  const currentUser = req.headers.cookie;

  if (currentUser.includes("userId")) {
    console.log("got passed middleware");
    return next();
  }
  throw new ExpressError(401, "Unknown User, Please Login");
};

const isAuthor = async (req, res, next) => {
  console.log("got into authorization middleware");

  const { id } = req.params;
  const currentUser = req.headers.cookie;
  const job = await Job.findById(id);
  if (currentUser.includes(job.postedBy)) return next();
  return res.json("Unauthorized User");
};

export { sanitizeJob, isLoggedIn, isAuthor };
