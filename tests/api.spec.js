const auth = require("../auth/auth-router");

describe("test one", function () {
  it("should run test using it()", function () {
    expect(true).toBe(true);
  });
});

//-----------------Test /register----------------------//
describe("Should register a new user", function () {
  //setup - Arrange
  const expected = auth.username;
  const user = auth.username;

  //execution of SUT(System Under Test) - Act
  const actual = auth.post(user);

  //assertions - Assert
  expect(actual).toBe(expected);
});
