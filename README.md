# Github Issue Tracker

A Node.js application that monitors Github repository activities and sends updates to Telex channels. Track issues, pull requests, and commits in real-time.

## Features

- 🎫 Track issue updates (creation, closure, modifications)
- 🔄 Monitor pull request activities
- 📝 Follow repository commit history
- ⏰ Configurable monitoring intervals
- 🔌 Easy integration with Telex

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Github Personal Access Token

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd github-issue-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
GITHUB_TOKEN=your_github_personal_access_token
```

## Configuration

The application can be configured through the `integration.json` file:

- `github_token`: Your Github Personal Access Token
- `repository`: Target repository in format `owner/repo`
- `interval`: Check frequency in crontab format
- `track_issues`: Enable/disable issue tracking
- `track_prs`: Enable/disable PR tracking
- `track_commits`: Enable/disable commit tracking

## Usage

Start the server:

```bash
npm start
```

The application exposes two main endpoints:

- POST `/api/check`: Performs repository check
- POST `/api/webhook`: Handles incoming webhooks

## Testing

Run the test suite:

```bash
npm test
```

## API Response Format

Updates are returned in the following format:

```json
{
  "messages": [
    {
      "text": "🎫 🟢 ISSUE: New feature request\n👤 By: username\n🔗 https://github.com/..."
    }
  ]
}
```

## License

ISC License

## Author

Ibraheem Bello
