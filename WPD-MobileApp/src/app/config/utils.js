// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hashPhoneNumber(phone) {
  if (!phone) return undefined

  var hash = 0,
    i,
    chr;
  if (phone.length === 0) return hash;

  for (i = 0; i < phone.length; i++) {
    chr = phone.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export default { hashPhoneNumber };
