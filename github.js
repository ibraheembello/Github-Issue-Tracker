const { Octokit } = require('@octokit/rest');

async function checkGithubUpdates(settings) {
    const octokit = new Octokit({
        auth: settings.github_token
    });

    const [owner, repo] = settings.repository.split('/');
    const updates = [];

    try {
        // Check issues if enabled
        if (settings.track_issues) {
            const { data: issues } = await octokit.issues.listForRepo({
                owner,
                repo,
                state: 'all',
                per_page: 10,
                sort: 'updated',
                direction: 'desc'
            });

            // Get issues updated in the last interval
            const recentIssues = issues.filter(issue => {
                const updateTime = new Date(issue.updated_at).getTime();
                const checkTime = new Date().getTime() - (30 * 60 * 1000); // 30 minutes
                return updateTime > checkTime;
            });

            updates.push(...recentIssues.map(issue => ({
                type: 'issue',
                action: issue.state === 'open' ? 'opened' : 'closed',
                title: issue.title,
                url: issue.html_url,
                user: issue.user.login
            })));
        }

        // Check PRs if enabled
        if (settings.track_prs) {
            const { data: prs } = await octokit.pulls.list({
                owner,
                repo,
                state: 'all',
                per_page: 10,
                sort: 'updated',
                direction: 'desc'
            });

            const recentPRs = prs.filter(pr => {
                const updateTime = new Date(pr.updated_at).getTime();
                const checkTime = new Date().getTime() - (30 * 60 * 1000);
                return updateTime > checkTime;
            });

            updates.push(...recentPRs.map(pr => ({
                type: 'pr',
                action: pr.state === 'open' ? 'opened' : 'closed',
                title: pr.title,
                url: pr.html_url,
                user: pr.user.login
            })));
        }

        // Check commits if enabled
        if (settings.track_commits) {
            const { data: commits } = await octokit.repos.listCommits({
                owner,
                repo,
                per_page: 10
            });

            const recentCommits = commits.filter(commit => {
                const commitTime = new Date(commit.commit.author.date).getTime();
                const checkTime = new Date().getTime() - (30 * 60 * 1000);
                return commitTime > checkTime;
            });

            updates.push(...recentCommits.map(commit => ({
                type: 'commit',
                action: 'pushed',
                title: commit.commit.message.split('\n')[0],
                url: commit.html_url,
                user: commit.author?.login || commit.commit.author.name
            })));
        }

        return updates;

    } catch (error) {
        console.error('Error fetching Github updates:', error);
        throw error;
    }
}

module.exports = { checkGithubUpdates };