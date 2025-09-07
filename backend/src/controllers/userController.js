const User = require("../models/User");
const { userUpdateSchema } = require("../utils/zodSchema");

// Get logged-in user's profile
async function getProfile(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update user profile
async function updateUser(req, res) {
  try {
    const body = JSON.parse(req.body || "{}");

    const userId = req.params.id;
    if (userId !== String(req.user._id)) {
      return res.status(403).json({ message: "You can modify only your own profile" });
    }

    const data = userUpdateSchema.parse(body);
    console.log(data)

    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


function getPagination(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

async function getAllUsers(req, res) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { page, limit, skip } = getPagination(req);

    const [users, total] = await Promise.all([
      User.find({ role: "user" })
          .skip(skip)
          .limit(limit)
          .select("-password"),
      User.countDocuments({ role: "user" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        count: users.length,
        users,
      },
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getUsersBySkills(req, res) {
  try {
    const skills = req.query.skills?.split(",") || [];
    if (skills.length === 0) {
      return res.status(400).json({ message: "Please provide at least one skill" });
    }

    const { page, limit, skip } = getPagination(req);

    const [users, total] = await Promise.all([
      User.find({ skills: { $in: skills } }).skip(skip).limit(limit),
      User.countDocuments({ skills: { $in: skills } }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: users.length,
      users,
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function searchUsers(req, res) {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const { page, limit, skip } = getPagination(req);

    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { education: { $regex: query, $options: "i" } },
        { "projects.title": { $regex: query, $options: "i" } },
        { "projects.desc": { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
      ],
    };

    const [users, total] = await Promise.all([
      User.find(searchFilter).skip(skip).limit(limit),
      User.countDocuments(searchFilter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: users.length,
      users,
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getTopSkills(req, res) {
  try {
    const skillsAgg = await User.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }, // top 10 skills
    ]);

    res.status(200).json({
      success: true,
      skills: skillsAgg,
    });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getProfile,
  updateUser,
  getAllUsers,
  getUsersBySkills,
  getTopSkills,
  searchUsers,
};

