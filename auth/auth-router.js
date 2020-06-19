// const router = require('express').Router();

// router.post('/register', (req, res) => {
//   // implement registration
// });

// router.post('/login', (req, res) => {
//   // implement login
// });

// module.exports = router;

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const { isValid } = require("../users/users-service");
const constants = require("../config/constants");
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  // validate the body, to make sure there is a username and password.
  const { username, password } = req.body;

  // hash user passwordjs (install bcryptjs)
  const rounds = process.env.HASH_ROUNDS || 8; // change to a higher number in production
  const hash = bcryptjs.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        console.log("user", user);
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = createToken(user);

          res.status(200).json({ token, message: "Welcome to our API" });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res
          .status(500)
          .json({ message: "could not log out, please try again" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

function createToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  // const secret = process.env.JWT_SECRET || "is it secret, is it safe?";
  const secret = constants.jwtSecret;
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
