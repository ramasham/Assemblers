import express from 'express';
import { authenticate, authorize } from '../middleware/auth.firebase.js';
import Operation from '../models/Operation.js';

const router = express.Router();

// Get all operations
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    const operations = await Operation.findAll(filters);
    
    res.json({
      success: true,
      count: operations.length,
      operations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get operations by category
router.get('/category/:category', authenticate, async (req, res) => {
  try {
    const { category } = req.params;
    const operations = await Operation.findByCategory(category);
    
    res.json({
      success: true,
      count: operations.length,
      category,
      operations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all categories
router.get('/categories', authenticate, async (req, res) => {
  try {
    const operations = await Operation.findAll();
    const categories = [...new Set(operations.map(op => op.category))];
    
    // Get count and total time for each category
    const categoryStats = categories.map(category => {
      const categoryOps = operations.filter(op => op.category === category);
      const totalTime = categoryOps.reduce((sum, op) => sum + op.standardTime, 0);
      
      return {
        category,
        count: categoryOps.length,
        totalStandardTime: totalTime,
        averageTime: totalTime / categoryOps.length
      };
    });
    
    res.json({
      success: true,
      categories: categoryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get operation by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const operation = await Operation.findById(id);
    
    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }
    
    res.json({
      success: true,
      operation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new operation (planner only)
router.post('/', authenticate, authorize('planner'), async (req, res) => {
  try {
    const { name, category, standardTime, description } = req.body;
    
    if (!name || !category || !standardTime) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and standardTime are required'
      });
    }
    
    const operation = await Operation.create({
      name,
      category,
      standardTime: parseFloat(standardTime),
      description
    });
    
    res.status(201).json({
      success: true,
      message: 'Operation created successfully',
      operation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update operation (planner only)
router.put('/:id', authenticate, authorize('planner'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const operation = await Operation.update(id, updates);
    
    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Operation updated successfully',
      operation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete operation (soft delete, planner only)
router.delete('/:id', authenticate, authorize('planner'), async (req, res) => {
  try {
    const { id } = req.params;
    await Operation.delete(id);
    
    res.json({
      success: true,
      message: 'Operation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
