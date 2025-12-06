const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  createTask, 
  updateTask, 
  requestDeleteTask, // NEW
  managerActionTask // NEW
} = require('../controllers/taskControllers');

// Standard CRUD
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);

// --- APPROVAL WORKFLOW ENDPOINTS ---

// POST (User Action): Client requests deletion, changes status to PENDING
router.post('/request-delete/:id', requestDeleteTask);

// PUT (Manager Action): Manager approves/rejects the request
router.put('/manager-action/:id', managerActionTask);

module.exports = router;