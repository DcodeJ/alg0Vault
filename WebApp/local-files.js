(function(root) {
  'use strict';
  const limit = 20 * 1024 * 1024;
  function create(options) {
    const { snapshot, replace, download, parse, confirm, status, buttons, input } = options;
    const env = options.env || root;
    let handle = null, diskText = null, savedStamp = null, busy = false, label = '', portableState = '';
    const stamp = () => JSON.stringify(snapshot());
    function refresh() {
      if (busy) return;
      const dirty = savedStamp !== null && stamp() !== savedStamp;
      status(handle ? `${label} — ${dirty ? 'changes need Save file' : 'file up to date'}. Reopen after restarting the app.` : savedStamp !== null ? `${portableState}${dirty ? '; newer changes need saving' : ''}. No file linked; Save file creates a new copy.` : 'No file linked. Save file creates a portable workspace.');
    }
    async function run(action) {
      if (busy) return;
      busy = true; buttons.forEach(x => x.disabled = true);
      let failed = false;
      try { await action(); }
      catch (error) {
        if (error.name !== 'AbortError') { failed = true; status(error.message || 'File operation failed. Your current workspace remains available.', true); }
      } finally { busy = false; buttons.forEach(x => x.disabled = false); if (!failed) refresh(); }
    }
    function serialize() {
      const current = snapshot();
      const text = JSON.stringify({ app: 'alg0Vault', version: 1, exportedAt: new Date().toISOString(), ...current }, null, 2);
      if (new Blob([text]).size > limit) throw Error('Workspace exceeds the 20 MB save-file limit. Export a backup and reduce its size before creating a loadable save file.');
      return { text, stamp: JSON.stringify(current) };
    }
    const pickerOptions = { types: [{ description: 'Study App workspace', accept: { 'application/json': ['.json'] } }] };
    async function save(asNew = false) {
      return run(async () => {
        let target = asNew ? null : handle;
        if (!target && typeof env.showSaveFilePicker === 'function') target = await env.showSaveFilePicker({ ...pickerOptions, suggestedName: 'Study-App-save.json' });
        if (target && target === handle && diskText !== await (await target.getFile()).text()) throw Error('This file changed outside the app. Open it again or use Save file as… to avoid overwriting those changes.');
        const saved = serialize();
        if (target) {
          let stream;
          try { stream = await target.createWritable(); await stream.write(saved.text); await stream.close(); }
          catch (error) { try { await stream?.abort(); } catch {} throw error; }
          handle = target; diskText = saved.text; label = target.name || 'Workspace file';
        } else {
          download('Study-App-save.json', saved.text);
          handle = null; diskText = null; label = ''; portableState = 'Download requested';
        }
        savedStamp = saved.stamp;
      });
    }
    async function load(file, target = null) {
      if (file.size > limit) throw Error('Choose a save file smaller than 20 MB.');
      const text = await file.text();
      const incoming = parse(text);
      if (!confirm(`Open “${file.name || 'workspace'}”? This REPLACES your algorithms, notes and study progress, including empty collections. Unposted reply drafts will be discarded. A safety backup download will be requested first. Import backup is the additive alternative.`)) return;
      download('Study-App-before-open-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', serialize().text);
      await replace(incoming);
      handle = target; diskText = target ? text : null; label = file.name || 'Workspace file'; portableState = 'Save file loaded';
      savedStamp = stamp();
    }
    function open() {
      if (busy) return;
      if (typeof env.showOpenFilePicker !== 'function') { input.value = ''; input.click(); return; }
      return run(async () => {
        const [target] = await env.showOpenFilePicker({ ...pickerOptions, multiple: false });
        if (target) await load(await target.getFile(), target);
      });
    }
    input.onchange = event => run(async () => {
      try { const file = event.target.files[0]; if (file) await load(file); }
      finally { event.target.value = ''; }
    });
    refresh();
    return { save, open, refresh, hasUnsavedFile: () => handle !== null && savedStamp !== stamp() };
  }
  root.VaultFiles = { create };
  if (typeof module !== 'undefined') module.exports = { create };
})(typeof window !== 'undefined' ? window : globalThis);
