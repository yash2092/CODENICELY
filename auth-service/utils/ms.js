/**
 * Tiny helper to convert duration strings like "15m", "7d", "1h" to milliseconds.
 * Only supports d, h, m, s suffixes. This avoids pulling in the `ms` npm package.
 */
function ms(val) {
  if (typeof val === 'number') return val;
  const match = /^(\d+)(d|h|m|s)$/.exec(String(val).trim());
  if (!match) throw new Error(`Invalid duration string: "${val}"`);
  const n = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'd': return n * 86400000;
    case 'h': return n * 3600000;
    case 'm': return n * 60000;
    case 's': return n * 1000;
    default:  return n;
  }
}

module.exports = ms;
