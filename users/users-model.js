const db = require("../database/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db("users").select("id", "username").orderBy("id");
}

// return the role name together with the user data
function findBy(filter) {
  // select u.id, u.username, u.password, r.name as role
  // from users as u
  // join roles as r on u.role = r.id
  return db("users as u")
    .select("u.id", "u.username", "u.password")
    .where(filter)
    .orderBy("u.id");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}
