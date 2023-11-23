
// Regular expression to match Unicode escape sequences (e.g., \uXXXX)
export const unicode_parser = (inputString) => {
    const unicodeEscapeRegex = /\\u[\dA-Fa-f]{4}/g;

    const str = inputString.replaceAll('\u0000', ' ')

    // Function to replace Unicode escape sequences with their corresponding characters
    function replaceUnicodeEscape(match) {
        return String.fromCharCode(parseInt(match.substring(2), 16));
    }

    // Use the replace method with the regular expression and replacement function
    const outputString = str.match(unicodeEscapeRegex)
        ? str.replace(unicodeEscapeRegex, replaceUnicodeEscape)
        : str;

    return outputString
}

