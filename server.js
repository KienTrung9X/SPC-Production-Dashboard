const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json()); // Middleware to parse JSON bodies

// In-memory store for mock data and confirmations
let mockPRData = [
  {
    pr_id: 'PR-001',
    status_pop: 'Sewing Started',
    planned_start_date: '2025-11-26',
    planned_completion_date: '2025-11-27',
    actual_completion_date: null,
    planned_quantity: 100,
    actual_quantity: 0,
    confirmations: {}
  },
  {
    pr_id: 'PR-002',
    status_pop: 'Sewing Complete',
    planned_start_date: '2025-11-26',
    planned_completion_date: '2025-11-26',
    actual_completion_date: '2025-11-26',
    planned_quantity: 200,
    actual_quantity: 195,
    confirmations: {
        TO_WASH: '2025-11-26T10:00:00Z'
    }
  },
  {
    pr_id: 'PR-003',
    status_pop: 'Not Started',
    planned_start_date: '2025-11-26',
    planned_completion_date: '2025-11-28',
    actual_completion_date: null,
    planned_quantity: 50,
    actual_quantity: 0,
    confirmations: {}
  }
];

// GET endpoint to fetch today's PR progress
app.get('/api/pr-progress/today', (req, res) => {
    console.log('GET /api/pr-progress/today - Returning mock data');
    res.json(mockPRData);
});

// POST endpoint to confirm a step
app.post('/api/pr-progress/confirm', (req, res) => {
    const { pr_id, step_name } = req.body;

    if (!pr_id || !step_name) {
        return res.status(400).json({ error: 'pr_id and step_name are required' });
    }

    console.log(`POST /api/pr-progress/confirm - Received confirmation for PR '${pr_id}', step '${step_name}'`);

    const prToUpdate = mockPRData.find(pr => pr.pr_id === pr_id);

    if (prToUpdate) {
        prToUpdate.confirmations[step_name] = new Date().toISOString();
        console.log(`Updated mock data for PR '${pr_id}':`, prToUpdate);
        res.status(200).json({ message: 'Confirmation successful' });
    } else {
        res.status(404).json({ error: `PR with id '${pr_id}' not found` });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Mock server is running on http://localhost:${port}`);
});
