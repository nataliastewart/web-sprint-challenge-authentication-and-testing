const router = require("express").Router();

const Users = require("./users-model");
const restricted = require("../auth/authenticate-middleware");

router.get("/", restricted, checkDepart(null), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json({ users, decodedToken: req.decodedToken });
    })
    .catch((err) => res.send(err));
});

function checkDepart(department) {
  return (req, res, next) => {
    if (req.decodedToken.department === department) {
      next();
    } else {
      res.status(403).json({ message: "you have no power here" });
    }
  };
}

module.exports = router;
