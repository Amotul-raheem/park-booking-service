export const isTokenExpired = (TokenCreationDate) => {
    const now = Date.now();
    const diff = (now - TokenCreationDate) / 1000;

    return diff > process.env.TOKEN_EXPIRATION;
}