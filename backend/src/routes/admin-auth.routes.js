const { Router } = require("express");
const { login, logout, getMe } = require("../controllers/admin-auth.controller");
const validate = require("../middleware/validate");
const { adminLoginSchema } = require("../schemas/admin.schema");
const { adminLoginLimiter } = require("../middleware/rate-limit");
const requireAdmin = require("../middleware/require-admin");

const router = Router();

router.post("/admin/login", adminLoginLimiter, validate(adminLoginSchema), login);
router.post("/admin/logout", requireAdmin, logout);
router.get("/admin/me", requireAdmin, getMe);

module.exports = router;
