const express = require('express');
const dotenv = require('dotenv');
const { checkGithubUpdates } = require('./github');
const { formatMessage } = require('./formatter');

// Load environment variables first
dotenv.config();

const app = express();
app.use(express.json());

// Add some debugging logs
app.post('/api/check', async (req, res) => {
    try {
        console.log('Received request with body:', req.body);
        
        // If no settings in request, use environment variables
        const settings = {
            github_token: process.env.GITHUB_TOKEN,
            repository: 'owner/repo', // Replace with the repository you want to monitor
            track_issues: true,
            track_prs: true,
            track_commits: false
        };

        const updates = await checkGithubUpdates(settings);
        
        if (updates.length > 0) {
            res.json({
                messages: updates.map(update => formatMessage(update))
            });
        } else {
            res.json({ messages: [] });
        }
    } catch (error) {
        console.error('Error in check endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/webhook', (req, res) => {
    res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Github token available:', !!process.env.GITHUB_TOKEN);
});