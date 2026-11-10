import express from 'express';

const router = express.Router();

// Placeholder routes for authentication (will be expanded with controller & validation)
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route active' });
});

export default router;
