const signup = (req, res) => {
  res.json({
    data: "you have reached signup endpoint",
  });
};

const login = (req, res) => {
  res.json({
    data: "you have reached login endpoint",
  });
};

const logout = (req, res) => {
  res.json({
    data: "you have reached logout endpoint",
  });
};

module.exports = { signup, login, logout };
