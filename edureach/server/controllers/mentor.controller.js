const Mentor = require("../models/Mentor");
const MentorMatch = require("../models/MentorMatch");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/mentors — list all with optional ?subject=&language= filters
exports.getMentors = async (req, res) => {
  try {
    const { subject, language } = req.query;
    const query = {};
    if (subject) query.subjects = subject;
    if (language) query.languages = language;

    const mentors = await Mentor.find(query).populate(
      "user",
      "name email profilePic language"
    );
    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mentors/request — student sends a request
exports.requestMentor = async (req, res) => {
  try {
    const { mentorUserId, subject } = req.body;
    const studentId = req.user._id;

    const existing = await MentorMatch.findOne({
      student: studentId,
      mentor: mentorUserId,
      status: { $in: ["pending", "active"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or active request with this mentor.",
      });
    }

    const match = await MentorMatch.create({
      student: studentId,
      mentor: mentorUserId,
      subject: subject || "",
    });

    res.status(201).json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/my-requests — student sees their outgoing requests
exports.getMyRequests = async (req, res) => {
  try {
    const matches = await MentorMatch.find({ student: req.user._id })
      .populate("mentor", "name email profilePic")
      .sort("-createdAt");
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/incoming — mentor sees incoming pending requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const matches = await MentorMatch.find({
      mentor: req.user._id,
      status: "pending",
    })
      .populate("student", "name email profilePic grade state")
      .sort("-createdAt");
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/mentors/request/:matchId — mentor accepts ("active") or declines ("closed")
exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await MentorMatch.findById(req.params.matchId);

    if (!match)
      return res.status(404).json({ success: false, message: "Match not found." });

    if (match.mentor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized." });

    match.status = status;
    await match.save();
    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/active-matches — active matches for current user (student or mentor)
exports.getActiveMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const matches = await MentorMatch.find({
      $or: [{ student: userId }, { mentor: userId }],
      status: "active",
    })
      .populate("student", "name email profilePic")
      .populate("mentor", "name email profilePic")
      .sort("-updatedAt");
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/messages/:matchId — chat history
exports.getMessages = async (req, res) => {
  try {
    const match = await MentorMatch.findById(req.params.matchId);
    if (!match)
      return res.status(404).json({ success: false, message: "Match not found." });

    const userId = req.user._id.toString();
    if (
      match.student.toString() !== userId &&
      match.mentor.toString() !== userId
    )
      return res.status(403).json({ success: false, message: "Not authorized." });

    const messages = await Message.find({ matchId: req.params.matchId })
      .populate("sender", "name profilePic")
      .sort("createdAt");
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mentors/rate/:matchId — student rates mentor, closes match
exports.rateMentor = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const match = await MentorMatch.findById(req.params.matchId);

    if (!match)
      return res.status(404).json({ success: false, message: "Match not found." });

    if (match.student.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Only the student can rate." });

    // Update mentor profile rating
    const mentor = await Mentor.findOne({ user: match.mentor });
    if (mentor) {
      const newTotal = mentor.totalSessions + 1;
      const newRating =
        (mentor.rating * mentor.totalSessions + rating) / newTotal;
      mentor.rating = Math.round(newRating * 10) / 10;
      mentor.totalSessions = newTotal;
      await mentor.save();
    }

    match.status = "closed";
    match.rating = rating;
    match.feedback = feedback || "";
    await match.save();

    res.json({ success: true, message: "Rating submitted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
