const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getProfile,
  updateUser,
  getAllUsers,
  getUsersBySkills,
  getTopSkills,
  searchUsers,
} = require("../controllers/userController");

router.use(auth);
// users routes
router.get('/', authorizeRoles('user','admin'), getProfile);
router.patch('/:id', authorizeRoles('user','admin'), updateUser);

// admin routes
router.get("/getall", authorizeRoles("admin"), getAllUsers);
// admin query routes
router.get("/projects", authorizeRoles("admin"), getUsersBySkills);
router.get("/skills/top", authorizeRoles("admin"), getTopSkills);
router.get("/search", authorizeRoles("admin"), searchUsers);
module.exports = router;
