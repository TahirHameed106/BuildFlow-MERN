const Task = require('../models/Task');

// 1. Get all tasks 
exports.getTasks = async (req, res) => {
  try {
    // We filter out tasks that have been approved for deletion but not yet removed
    const tasks = await Task.find({ status: { $ne: 'Deletion Approved' } }).sort({ createdAt: -1 });
    res.json({ success: true, tasks: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Create a new task (Standard)
exports.createTask = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    const task = await Task.create({ description });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Update a task (Standard status update)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- NEW: TASK DELETION WORKFLOW ---

// 4. Request Deletion (User action)
exports.requestDeleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body; // Mandatory reason
        
        if (!reason) {
            return res.status(400).json({ success: false, message: 'A reason is mandatory for deletion requests.' });
        }

        const task = await Task.findByIdAndUpdate(id, {
            status: 'Pending Manager Approval',
            deletionRequested: true,
            deletionReason: reason,
        }, { new: true });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Deletion request sent for manager approval.', task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. Manager Action: Approve/Reject Deletion
exports.managerActionTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (action === 'approve') {
            // Manager approves: DELETE the task permanently
            const task = await Task.findByIdAndDelete(id);
            if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
            return res.json({ success: true, message: 'Task approved and deleted.' });
        } 
        
        if (action === 'reject') {
            // Manager rejects: Reset status and flags
            const task = await Task.findByIdAndUpdate(id, {
                status: 'Pending', // Return to default status
                deletionRequested: false,
                deletionReason: null,
            }, { new: true });
            
            if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
            return res.json({ success: true, message: 'Deletion request rejected. Task restored to Pending.' });
        }

        return res.status(400).json({ success: false, message: 'Invalid manager action.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};