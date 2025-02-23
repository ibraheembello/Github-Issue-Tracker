function formatMessage(update) {
    const emoji = {
        issue: '🎫',
        pr: '🔄',
        commit: '📝'
    };

    const actionColor = {
        opened: '🟢',
        closed: '🔴',
        pushed: '🟣'
    };

    return {
        text: `${emoji[update.type]} ${actionColor[update.action]} ${update.type.toUpperCase()}: ${update.title}\n` +
              `👤 By: ${update.user}\n` +
              `🔗 ${update.url}`
    };
}

module.exports = { formatMessage };