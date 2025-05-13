function detectAttackType(input) {
  const lower = input.toLowerCase();

  // Tautology attacks
  if (
    /('|")?\s*or\s*('|")?\d\s*=\s*\d/i.test(lower) || // admin' OR 1=1
    /\b1\s*=\s*1\b/.test(lower)
  ) {
    return "Tautology";
  }

  // Union-based attacks
  if (/union\s+select/i.test(lower)) {
    return "Union-based";
  }

  // Piggybacked queries
  if (/;.*(drop|insert|update|delete)/i.test(lower)) {
    return "Piggybacked";
  }

  // Inference-based (Blind)
  if (/and\s+\d\s*=\s*\d/i || /sleep\(/i || /waitfor\s+delay/i.test(lower)) {
    return "Inference / Blind";
  }

  // Encoded attacks
  if (/(%27|char\(|0x|unhex)/i.test(lower)) {
    return "Alternate Encoding";
  }

  // Comment injection
  if (/#|--|\/\*/.test(lower)) {
    return "Comment Injection / Obfuscation";
  }

  return "Unknown";
}

module.exports = detectAttackType;
