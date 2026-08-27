// constants.js

// Base units (milliseconds)
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR   = 60 * MINUTE;
export const DAY    = 24 * HOUR;
export const WEEK   = 7 * DAY;

// In seconds (useful for JWT, exp, etc.)
export const SECOND_IN_SEC = 1;
export const MINUTE_IN_SEC = 60;
export const HOUR_IN_SEC   = 60 * MINUTE_IN_SEC;
export const DAY_IN_SEC    = 24 * HOUR_IN_SEC;

// JWT / Session examples
export const ACCESS_TOKEN_EXPIRY = 15 * MINUTE_IN_SEC; // 15 min
export const REFRESH_TOKEN_EXPIRY = 7 * DAY_IN_SEC;    // 7 days