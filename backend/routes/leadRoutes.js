import express from 'express';

const router = express.Router();

// Placeholder routes for leads (will be expanded with controller & validation)
router.get('/test', (req, res) => {
  res.json({ message: 'Lead route active' });
});

export default router;
