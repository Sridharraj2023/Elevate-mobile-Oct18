import asyncHandler from 'express-async-handler';
import TermsAndConditions from '../models/TermsAndConditions.js';

// @desc    Get active terms (Public - for Flutter app)
// @route   GET /api/terms/active
// @access  Public
const getActiveTerms = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findOne({ isActive: true });
  
  if (!terms) {
    res.status(404);
    throw new Error('No active terms found');
  }
  
  res.json(terms);
});

// @desc    Get all terms versions (Admin only)
// @route   GET /api/terms/admin
// @access  Private/Admin
const getAllTermsVersions = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.find()
    .populate('publishedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(terms);
});

// @desc    Get specific terms version
// @route   GET /api/terms/admin/:id
// @access  Private/Admin
const getTermsById = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findById(req.params.id)
    .populate('publishedBy', 'name email');
  
  if (!terms) {
    res.status(404);
    throw new Error('Terms version not found');
  }
  
  res.json(terms);
});

// @desc    Create new terms version
// @route   POST /api/terms/admin
// @access  Private/Admin
const createTerms = asyncHandler(async (req, res) => {
  const { title, content, version, effectiveDate } = req.body;
  
  // Check if version already exists
  const versionExists = await TermsAndConditions.findOne({ version });
  if (versionExists) {
    res.status(400);
    throw new Error('Version already exists');
  }
  
  const terms = await TermsAndConditions.create({
    title,
    content,
    version,
    publishedBy: req.user._id,
    effectiveDate: effectiveDate || Date.now(),
    isActive: false
  });
  
  res.status(201).json(terms);
});

// @desc    Update terms version
// @route   PUT /api/terms/admin/:id
// @access  Private/Admin
const updateTerms = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findById(req.params.id);
  
  if (!terms) {
    res.status(404);
    throw new Error('Terms version not found');
  }
  
  // Don't allow updating if it's active
  if (terms.isActive) {
    res.status(400);
    throw new Error('Cannot edit active terms. Create a new version instead.');
  }
  
  terms.title = req.body.title || terms.title;
  terms.content = req.body.content || terms.content;
  terms.version = req.body.version || terms.version;
  terms.effectiveDate = req.body.effectiveDate || terms.effectiveDate;
  
  const updatedTerms = await terms.save();
  res.json(updatedTerms);
});

// @desc    Publish/activate terms version
// @route   PUT /api/terms/admin/:id/publish
// @access  Private/Admin
const publishTerms = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findById(req.params.id);
  
  if (!terms) {
    res.status(404);
    throw new Error('Terms version not found');
  }
  
  // Deactivate all other versions
  await TermsAndConditions.updateMany(
    { isActive: true },
    { isActive: false }
  );
  
  // Activate this version
  terms.isActive = true;
  terms.publishedAt = Date.now();
  terms.publishedBy = req.user._id;
  
  const publishedTerms = await terms.save();
  res.json(publishedTerms);
});

// @desc    Unpublish terms version
// @route   PUT /api/terms/admin/:id/unpublish
// @access  Private/Admin
const unpublishTerms = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findById(req.params.id);
  
  if (!terms) {
    res.status(404);
    throw new Error('Terms version not found');
  }
  
  terms.isActive = false;
  const unpublishedTerms = await terms.save();
  res.json(unpublishedTerms);
});

// @desc    Delete terms version
// @route   DELETE /api/terms/admin/:id
// @access  Private/Admin
const deleteTerms = asyncHandler(async (req, res) => {
  const terms = await TermsAndConditions.findById(req.params.id);
  
  if (!terms) {
    res.status(404);
    throw new Error('Terms version not found');
  }
  
  // Don't allow deleting active version
  if (terms.isActive) {
    res.status(400);
    throw new Error('Cannot delete active terms version');
  }
  
  await TermsAndConditions.findByIdAndDelete(req.params.id);
  res.json({ message: 'Terms version deleted successfully' });
});

export {
  getActiveTerms,
  getAllTermsVersions,
  getTermsById,
  createTerms,
  updateTerms,
  publishTerms,
  unpublishTerms,
  deleteTerms
};

