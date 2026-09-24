/* Language selection is presentation state; C# remains in the legacy code field. */
(function (root) {
  'use strict';
  const names = Object.freeze({ csharp: 'C#', cpp: 'C++', python: 'Python' });
  const valid = key => Object.hasOwn(names, key);
  const label = key => names[key] || names.csharp;
  const samples = root.ALG0_LANGUAGE_SAMPLES || { patterns: {}, algorithms: {}, algorithmPatterns: {} };
  // Resolve built-in examples by stable ID, not an editable user title.
  const builtins = new Map((root.ALG0_ALGORITHMS || []).map(a => [a.id,
    samples.algorithms[a.title] || samples.patterns[samples.algorithmPatterns[a.title]]]));
  const cppHeader = ['algorithm','array','cstddef','cstdint','deque','functional','limits','memory','numeric','optional','queue','stdexcept','string','tuple','unordered_map','unordered_set','utility','vector']
    .map(header => '#include <' + header + '>').join('\n') + '\nusing namespace std;\n\n';
  const checkedAdd = `// Fail explicitly instead of overflowing signed 64-bit arithmetic.
inline long long checkedAdd(long long a, long long b) {
    constexpr auto high = numeric_limits<long long>::max();
    constexpr auto low = numeric_limits<long long>::min();
    if ((b > 0 && a > high - b) || (b < 0 && a < low - b))
        throw overflow_error("Addition exceeds signed 64-bit range");
    return a + b;
}

`;
  const checkedMultiply = `inline long long checkedMultiply(long long a, long long b) {
    constexpr auto high = numeric_limits<long long>::max();
    constexpr auto low = numeric_limits<long long>::min();
    if ((a > 0 && ((b > 0 && a > high / b) || (b < 0 && b < low / a))) ||
        (a < 0 && ((b > 0 && a < low / b) || (b < 0 && a < high / b))))
        throw overflow_error("Product exceeds signed 64-bit range");
    return a * b;
}

`;
  function wrap(code, language) {
    return language === 'cpp' ? '// C++17 reference functions. Add your own main() or adapt to the judge signature.\n' + cppHeader +
      (code.includes('checkedAdd(') ? checkedAdd : '') + (code.includes('checkedMultiply(') ? checkedMultiply : '') + code :
      language === 'python' ? '# Python 3 reference. Adapt the function signature to your assignment.\n' + code : code;
  }
  function get(record, language) {
    if (!valid(language) || language === 'csharp') return { code: record.code || '', source: 'saved' };
    if (Object.hasOwn(record.implementations || {}, language))
      return { code: record.implementations[language], source: 'saved' };
    const sample = builtins.get(record.id)?.[language];
    return sample ? { code: wrap(sample, language), source: 'reference' } : { code: '', source: 'missing' };
  }
  function set(record, language, code) {
    if (!valid(language)) throw new Error('Unsupported programming language.');
    if (language === 'csharp') record.code = code;
    else { record.implementations ||= {}; record.implementations[language] = code; }
  }
  function pattern(id, language) {
    const code = samples.patterns[id]?.[language];
    return code === undefined ? '' : wrap(code, language);
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const keywords = {
    csharp: 'abstract as async await bool break case catch char class const continue decimal default do double else enum false finally float for foreach if in int interface internal is long namespace new null object out override private protected public readonly record ref required return sealed short static string struct switch this throw true try typeof uint ulong using var virtual void while',
    cpp: 'auto bool break case catch char class const constexpr continue default delete do double else enum explicit false float for if int long namespace new nullptr private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while',
    python: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield'
  };
  const matchers = new Map();
  function highlight(code, language = 'csharp') {
    if (!valid(language)) language = 'csharp';
    if (!matchers.has(language)) {
      const comments = language === 'python' ? '#[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
      const triples = language === 'python' ? '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|' : '';
      const strings = '"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'';
      matchers.set(language, new RegExp(triples + comments + '|' + strings + '|\\b(?:' + keywords[language].split(' ').join('|') + ')\\b|\\b\\d+(?:\\.\\d+)?\\b', 'g'));
    }
    const source = String(code ?? ''); let result = '', last = 0;
    source.replace(matchers.get(language), (token, offset) => {
      result += escape(source.slice(last, offset));
      const comment = language === 'python' ? token.startsWith('#') : token.startsWith('//') || token.startsWith('/*');
      const kind = comment ? 'com' : /^['"]/.test(token) ? 'str' : /^\d/.test(token) ? 'num' : 'kw';
      result += '<span class="' + kind + '">' + escape(token) + '</span>'; last = offset + token.length;
      return token;
    });
    return result + escape(source.slice(last));
  }
  const api = { names, valid, label, get, set, pattern, highlight };
  root.VaultLanguages = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
