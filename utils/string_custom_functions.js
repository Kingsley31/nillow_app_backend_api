module.exports.toTitleCase = (str) => {
    return str
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};


module.exports.toSentenceCase = (str) => {
    const sentenceCase = str.toLowerCase()
        .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
            return c.toUpperCase();
        });
    return sentenceCase;
};


