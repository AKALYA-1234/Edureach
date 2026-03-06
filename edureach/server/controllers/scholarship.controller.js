const Scholarship = require("../models/Scholarship");

// @desc   Get all scholarships with filters
// @route  GET /api/scholarships
exports.getScholarships = async (req, res) => {
  try {
    const { state, caste, income, gender, grade, search, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (state) filter["eligibility.state"] = { $in: ["", "All", state] };
    if (caste) filter["eligibility.caste"] = { $in: ["", "All", caste] };
    if (income) filter["eligibility.income"] = { $in: ["", "All", income] };
    if (gender) filter["eligibility.gender"] = { $in: ["", "All", gender] };
    if (grade) filter["eligibility.grade"] = { $in: ["", "All", grade] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Scholarship.countDocuments(filter);
    const scholarships = await Scholarship.find(filter)
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: scholarships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single scholarship
// @route  GET /api/scholarships/:id
exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create scholarship
// @route  POST /api/scholarships
exports.createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Check student eligibility for a scholarship
// @route  GET /api/scholarships/:id/eligibility
exports.checkEligibility = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    const user = req.user;
    const elig = scholarship.eligibility || {};
    const reasons = [];
    let eligible = true;

    if (elig.state && elig.state !== "All" && elig.state !== "" && user.state && user.state !== elig.state) {
      eligible = false;
      reasons.push(`State: requires ${elig.state}, you have ${user.state || "not set"}`);
    }
    if (elig.gender && elig.gender !== "All" && elig.gender !== "" && user.gender && user.gender !== elig.gender) {
      eligible = false;
      reasons.push(`Gender: requires ${elig.gender}`);
    }
    if (elig.grade && elig.grade !== "All" && elig.grade !== "" && user.grade && user.grade !== elig.grade) {
      eligible = false;
      reasons.push(`Grade: requires ${elig.grade}, you have ${user.grade || "not set"}`);
    }

    res.json({
      success: true,
      data: {
        eligible,
        reasons,
        scholarship: scholarship.title,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Student applies for a scholarship (track applied)
// @route  POST /api/scholarships/:id/apply
exports.applyScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    // Track in user document (we'll store applied scholarship IDs)
    const user = req.user;
    if (!user.appliedScholarships) user.appliedScholarships = [];
    if (user.appliedScholarships.includes(scholarship._id)) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }
    user.appliedScholarships.push(scholarship._id);
    await user.save();

    res.json({
      success: true,
      message: "Application tracked",
      data: { scholarshipId: scholarship._id, applicationUrl: scholarship.applicationUrl },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get student's applied scholarships
// @route  GET /api/scholarships/applied
exports.getAppliedScholarships = async (req, res) => {
  try {
    const user = req.user;
    const ids = user.appliedScholarships || [];
    const scholarships = await Scholarship.find({ _id: { $in: ids } });
    res.json({ success: true, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
