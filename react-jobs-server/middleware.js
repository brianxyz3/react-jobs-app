const validator = require("validator");
const ExpressError = require("./utilities/ExpressError.js");
const Job = require("./model/job.js");

const sanitizeJob = (req, res, next) => {
  try {
    console.log("Got into job sanitize middleware");

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
    console.log("An error occurred " + err);
  }
};

const sanitizeUser = (req, res, next) => {
  try {
    validator.escape(req.body.currentUser);
    next();
  } catch (err) {
    console.log("An error occurred " + err);
  }
};

const isLoggedIn = (req, res, next) => {
  console.log("got into authentication middleware");
  const cookieObj = {};
  try{
    const cookieStr = req.headers.cookie;
    const cookieArr = cookieStr.split(";");
    cookieArr.forEach(cookie => {
      const [key, value] = cookie.trim().split("=");
      cookieObj[key] = value;
    });
    if (cookieObj.userId) {
      return next();
    }
    throw new ExpressError(401, "Unknown User, Please Login");
  } catch(err) {
    console.log("An error occurred " + err);
  }
};

const isAuthor = async (req, res, next) => {
  console.log("got into authorization middleware");
  try{
    const { id } = req.params;
    const currentUser = req.headers.cookie;
    const job = await Job.findById(id);
    if (currentUser.includes(job.postedBy)) return next();
    return res.json("Unauthorized User");
  } catch(err) {
    console.log("An error occurred " + err);  
  }
};

module.exports = { sanitizeJob, sanitizeUser, isLoggedIn, isAuthor };
