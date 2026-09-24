/* Pure validation and backup helpers shared by the app and its regression checks. */
(function (root) {
  'use strict';
  const string = (value, fallback = '') => typeof value === 'string' ? value : fallback;
  const id = () => root.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : new Date().toISOString();
  const choice = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  function rows(value) {
    if (!Array.isArray(value) || value.length > 10000 || value.some(x => !x || typeof x !== 'object' || Array.isArray(x))) {
      throw new Error('Expected a collection of valid records (up to 10,000).');
    }
    return value;
  }
  function implementations(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid language implementations.');
    const result = {};
    for (const key of Object.keys(value)) {
      if (!['cpp', 'python'].includes(key) || typeof value[key] !== 'string') throw new Error('Unsupported or invalid language implementation.');
      result[key] = value[key];
    }
    return result;
  }
  function algorithms(value) {
    const seen = new Set();
    return rows(value).map(x => {
      let recordId = string(x.id) || id();
      if (seen.has(recordId)) recordId = id();
      seen.add(recordId);
      return {
        id: recordId, title: string(x.title, 'Untitled algorithm'),
        category: string(x.category, 'Other'), difficulty: choice(x.difficulty, ['Easy', 'Medium', 'Hard'], 'Medium'),
        priority: choice(x.priority, ['Essential','Core','Advanced','Unranked'], root.VaultCatalog?.priority(x) || 'Unranked'),
        timeComplexity: string(x.timeComplexity), spaceComplexity: string(x.spaceComplexity),
        code: string(x.code), ...(x.implementations !== undefined ? { implementations: implementations(x.implementations) } : {}), summary: string(x.summary), notes: string(x.notes),
        tags: string(x.tags), pattern: string(x.pattern, 'General'), favorite: x.favorite === true,
        masteryLevel: choice(x.masteryLevel, ['New', 'Learning', 'Confident', 'Mastered'], 'New'),
        reviewCount: Number.isSafeInteger(x.reviewCount) && x.reviewCount > 0 ? x.reviewCount : 0,
        lastReviewedAt: x.lastReviewedAt ? date(x.lastReviewedAt) : null, updatedAt: date(x.updatedAt)
      };
    });
  }
  function notes(value) {
    const seen = new Set();
    return rows(value).map(x => {
      let recordId = string(x.id) || id();
      if (seen.has(recordId)) recordId = id();
      seen.add(recordId);
      return {
        id: recordId, title: string(x.title, 'Untitled thread'), course: string(x.course, 'General'),
        semester: string(x.semester, 'Semester 1'), body: string(x.body), pinned: x.pinned === true,
        updatedAt: date(x.updatedAt), replies: rows(x.replies || []).map(r => ({
          author: string(r.author, 'You'), content: string(r.content), createdAt: date(r.createdAt)
        }))
      };
    });
  }
  function learning(value) {
    const seen = new Set();
    return rows(value).map(x => {
      if (typeof x.id !== 'string' || !x.id || x.id.length > 200 || seen.has(x.id)) throw new Error('Learning progress needs unique, valid IDs.');
      seen.add(x.id);
      const validTime = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
      return { id: x.id, completed: x.completed === true, notes: string(x.notes), updatedAt: date(x.updatedAt),
        bookmarked: x.bookmarked === true, reviewEnabled: x.reviewEnabled === true,
        reviewDue: validTime(x.reviewDue), lastReviewed: validTime(x.lastReviewed),
        reviewStep: Number.isInteger(x.reviewStep) && x.reviewStep >= 0 && x.reviewStep <= 4 ? x.reviewStep : 0,
        recallCount: Number.isSafeInteger(x.recallCount) && x.recallCount >= 0 ? Math.min(x.recallCount, 1000000) : 0 };
    });
  }
  function parseBackup(text) {
    if (text.length > 20 * 1024 * 1024) throw new Error('Backup exceeds the 20 MB import limit.');
    const value = JSON.parse(text);
    if (!value || value.app !== 'alg0Vault' || value.version !== 1) throw new Error('Choose an alg0Vault workspace backup (version 1).');
    return { algorithms: algorithms(value.algorithms), notes: notes(value.notes), ...(value.learning !== undefined ? { learning: learning(value.learning) } : {}) };
  }
  function merge(existing, incoming) {
    const result = [...existing];
    const ids = new Set(existing.map(x => x.id));
    // Existing IDs win. Import is additive, so a backup cannot overwrite newer work.
    for (const record of incoming) if (!ids.has(record.id)) { result.push(record); ids.add(record.id); }
    return rows(result); // Never persist an import that startup validation would reject.
  }
  function backup(algorithmRows, noteRows, learningRows) {
    return JSON.stringify({ app: 'alg0Vault', version: 1, exportedAt: new Date().toISOString(), algorithms: algorithmRows, notes: noteRows, ...(learningRows !== undefined ? { learning: learningRows } : {}) }, null, 2);
  }
  const api = { algorithms, notes, learning, parseBackup, merge, backup };
  root.VaultData = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
