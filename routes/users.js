const router = require("express").Router();
const {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUserInfo);
router.get("/:userId", getUserById);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
