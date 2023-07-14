export const DELIMETERS = {
  FOLDER: '!',
  NAME: '~',
  PATH: '/',
};

export const ERRORS = {
  FILENAME_IS_TOO_LONG: 'Filename or path is too long',
  SHOULD_USE_VALID_SYMBOLS: 'Filename is allowed to include only A-z 0–9 - _ . ( ) symbols',
  SYSTEM_SYMBOLS: `Filename is not allowed to include ${Object.values(DELIMETERS).join(' ')} symbols`,
};
