const express = require("express");
const router = express.Router();
const peopleController = require("../controllers/peopleController");
const authenticate = require("../middleware/authenticate");
const requireAnyRole = require("../middleware/requireAnyRole");
const requireRole = require("../middleware/requireRole");

router.get("/", peopleController.getAll);
router.get("/:id", peopleController.getById);

router.post("/", authenticate, requireAnyRole(["admin","editor"]), peopleController.create);
router.put("/:id", authenticate, requireAnyRole(["admin","editor"]), peopleController.update);

router.delete("/:id", authenticate, requireRole("admin"), peopleController.remove);

module.exports = router;
