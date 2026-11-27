/**
 * Ambil hanya key yang ada di allowedKeys dari object src.
 * Key dengan nilai undefined dibuang agar tidak menimpa data di DB.
 */
const pick = (src = {}, allowedKeys = []) =>
  Object.fromEntries(
    allowedKeys
      .filter((k) => src[k] !== undefined)
      .map((k) => [k, src[k]])
  );

module.exports = pick;
