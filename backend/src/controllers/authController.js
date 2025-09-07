const authService = require("../services/authService");
const { userSchema } = require("../utils/zodSchema");

exports.signup = async (req, res) => {
  try {
    // No need for JSON.parse if express.json() is used
    const body = JSON.parse(req.body || "{}");

    const data = userSchema.parse(body);  

    const result = await authService.registerUser(data);

    res.status(201).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // For login, validate with a smaller schema (only email + password)
    const body = JSON.parse(req.body || "{}");

    const { email, password } = body;

    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
