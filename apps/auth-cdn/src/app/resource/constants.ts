export const DELIMETERS = {
  FOLDER: '!',
  NAME: '~',
  PATH: '/',
  SEARCH_ANY_CHAR: '*',
};

const ALL_SYSTEM_SYMBOLS = Object.values(DELIMETERS);

const FORBIDDEN_PATH_SYMBOLS = ALL_SYSTEM_SYMBOLS.filter((s) => s !== DELIMETERS.PATH);
const FORBIDDEN_FILENAME_SYMBOLS = ALL_SYSTEM_SYMBOLS;

export const MAX_FILENAME_LENGTH = 256;

export const PATH_WITHOUT_SYSTEM_SYMBOLS_REGEXP = new RegExp(`[${FORBIDDEN_PATH_SYMBOLS.map((s) => `\\${s}`)}]`);
export const FILENAME_WITHOUT_SYSTEM_SYMBOLS_REGEXP = new RegExp(
  `[${FORBIDDEN_FILENAME_SYMBOLS.map((s) => `\\${s}`)}]`
);

export const ERRORS = {
  FILENAME_IS_TOO_LONG: 'Filename or path is too long',
  SHOULD_USE_VALID_SYMBOLS: 'Filename is allowed to include only A-z 0–9 - _ . ( ) symbols',
  FILENAME_HAS_SYSTEM_SYMBOLS: `Filename is not allowed to include ${FORBIDDEN_FILENAME_SYMBOLS.join(' ')} symbols`,
  PATH_HAS_SYSTEM_SYMBOLS: `Path is not allowed to include ${FORBIDDEN_PATH_SYMBOLS.join(' ')} symbols`,
};
