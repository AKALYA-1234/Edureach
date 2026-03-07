const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/mentor.controller");

router.get("/", ctrl.getMentors);
router.post("/request", verifyToken, ctrl.requestMentor);
router.get("/my-requests", verifyToken, ctrl.getMyRequests);
router.get("/incoming", verifyToken, ctrl.getIncomingRequests);
router.patch("/request/:matchId", verifyToken, ctrl.respondToRequest);
router.get("/active-matches", verifyToken, ctrl.getActiveMatches);
router.get("/messages/:matchId", verifyToken, ctrl.getMessages);
router.post("/rate/:matchId", verifyToken, ctrl.rateMentor);

module.exports = router;
