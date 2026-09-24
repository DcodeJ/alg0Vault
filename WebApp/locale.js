/* Opt-in presentation layer: no user values, HTML replacement, or app-state re-rendering. */
(function(root) {
  'use strict';
  const key = 'alg0vault.web.locale.v1';
  const table = root.ALG0_UI_TRANSLATIONS || {};
  const polish = new Map(Object.values(table).map(pair => [pair[0],pair[1]]));
  const liveIds = ["saveStatus","fileStatus","resultCount","libraryTitle","addAlgorithmPack","editCode","copyPatternCode","revealSolution","pinNote","focusToggle","focusStatus","deskProgress","deskSearchCount","learningCount","learningProgress","courseProgress","learningContinue","learningComplete","patternCount","tutorialPosition","toast","studyBookmark","studyReviewToggle","studyGood"];
  const state = new WeakMap();
  let locale = 'en', observer;
  try { if (root.localStorage.getItem(key) === 'pl') locale = 'pl'; } catch {}
  const valid = value => value === 'en' || value === 'pl';
  function t(value) {
    const text = String(value ?? '');
    if (locale !== 'pl') return text;
    if (polish.has(text)) return polish.get(text);
    const rules = [
      [/^(\d+) items?$/, 'Liczba pozycji: $1'],
      [/^Add (\d+) new algorithms$/, 'Dodaj nowe algorytmy: $1'],
      [/^(\d+) \/ (\d+) entries$/, '$1 / $2 materiałów'],
      [/^(\d+) \/ (\d+) questions$/, '$1 / $2 zadań'],
      [/^(\d+) \/ (\d+) patterns$/, '$1 / $2 wzorców'],
      [/^(\d+) \/ (\d+) guides reviewed$/, 'Przejrzane przewodniki: $1 / $2'],
      [/^(\d+) \/ (\d+) roadmap weeks complete$/, 'Ukończone tygodnie planu: $1 / $2'],
      [/^(\d+) \/ (\d+) weeks · (\d+) \/ (\d+) chapters$/, 'Tygodnie: $1 / $2 · Rozdziały: $3 / $4'],
      [/^Continue · Week (\d+)$/, 'Kontynuuj · Tydzień $1'],
      [/^Step (\d+) of (\d+)$/, 'Krok $1 z $2'],
      [/^(\d+) matches( · showing first 40)?$/, (_,n,more) => 'Wyniki: '+n+(more?' · pierwsze 40':'')],
      [/^Edit (C#|C\+\+|Python)$/, 'Edytuj $1'],
      [/^Copy (C#|C\+\+|Python)$/, 'Kopiuj $1'],
      [/^(C#|C\+\+|Python) IMPLEMENTATION$/, 'IMPLEMENTACJA $1'],
      [/^(C#|C\+\+|Python) implementation$/, 'Implementacja $1'],
      [/^(C#|C\+\+|Python) REFERENCE SOLUTION$/, 'ROZWIĄZANIE W $1'],
      [/^06 \/ (C#|C\+\+|Python) reference template$/, '06 / Szablon w $1'],
      [/^Got it · (\d+) days?$/, 'Rozumiem · liczba dni: $1'],
      [/^Delete “([\s\S]*)”\?$/, 'Usunąć „$1”?'],
      [/^Delete comment (\d+)$/, 'Usuń komentarz $1'],
      [/^Import (\d+) new records\? Existing records with the same ID will be kept\.$/, 'Zaimportować nowe wpisy ($1)? Istniejące wpisy o tych samych identyfikatorach zostaną zachowane.'],
      [/^Imported (\d+) records\.$/, 'Zaimportowano wpisy: $1.'],
      [/^Import failed: ([\s\S]*)$/, (_,detail) => 'Import nie powiódł się: '+(polish.get(detail)||detail)],
      [/^Load failed; current workspace preserved\. ([\s\S]*)$/, (_,detail) => 'Wczytywanie nie powiodło się; bieżące dane zostały zachowane. '+(polish.get(detail)||detail)],
      [/^Built-in (C#|C\+\+|Python) reference for the original algorithm\. Personal C# edits are not automatically translated\. Check this version’s signature and comments; C#-specific notes may differ\.$/, 'Wbudowany przykład w $1 dla oryginalnego algorytmu. Twoje zmiany w C# nie są tłumaczone automatycznie. Sprawdź sygnaturę i komentarze; notatki dotyczące C# mogą się różnić.'],
      [/^(C#|C\+\+|Python) code is saved separately\. Switching languages keeps your other implementations\.$/, 'Kod w $1 jest zapisywany osobno. Zmiana języka nie usuwa innych implementacji.'],
      [/^No built-in (C#|C\+\+|Python) version for this entry yet\. Use Edit (C#|C\+\+|Python) to add your own\. Your C# code is unchanged\.$/, 'Brak wbudowanej wersji w $1 dla tego wpisu. Wybierz Edytuj $2, aby dodać własną. Kod C# pozostaje bez zmian.'],
      [/^Reviewed (\d+)× · ([\s\S]+)$/, 'Powtórki: $1 · $2'],
      [/^Updated ([\s\S]+) · (\d+) replies$/, 'Aktualizacja: $1 · Odpowiedzi: $2'],
      [/^([\s\S]+) — (changes need Save file|file up to date)\. Reopen after restarting the app\.$/, (_,name,status) => name+' — '+(status==='file up to date'?'plik jest aktualny':'zmiany wymagają zapisu do pliku')+'. Po ponownym uruchomieniu otwórz plik jeszcze raz.'],
      [/^(Download requested|Save file loaded)(; newer changes need saving)?\. No file linked; Save file creates a new copy\.$/, (_,status,dirty) => (status==='Download requested'?'Zażądano pobrania':'Plik zapisu wczytany')+(dirty?'; nowsze zmiany wymagają zapisu':'')+'. Brak połączonego pliku; Zapisz plik tworzy nową kopię.'],
      [/^Open “([\s\S]*)”\? This REPLACES your algorithms, notes and study progress, including empty collections\. Unposted reply drafts will be discarded\. A safety backup download will be requested first\. Import backup is the additive alternative\.$/, 'Otworzyć „$1”? To ZASTĄPI algorytmy, notatki i postęp nauki, także pustymi kolekcjami. Nieopublikowane szkice odpowiedzi zostaną odrzucone. Najpierw zostanie pobrana kopia bezpieczeństwa. Importuj kopię pozwala zamiast tego dodać brakujące dane.'],
      [/^Marked (New|Learning|Confident|Mastered)$/, (_,value) => 'Oznaczono: '+(polish.get(value)||value)]
    ];
    for (const [pattern,replacement] of rules)
      if (pattern.test(text)) return text.replace(pattern,replacement);
    return text;
  }
  function protectedText(element) {
    // Never rewrite marked text inside code, user-editable content, or an opt-out subtree.
    return element.matches?.('input,textarea,pre,code,[contenteditable],[data-no-i18n]') ||
      element.closest?.('pre,code,textarea,[contenteditable],[data-no-i18n]') ||
      element.childElementCount > 0;
  }
  function translateElement(el, english) {
    if (protectedText(el)) return;
    const translated = t(english);
    if (el.textContent !== translated) el.textContent = translated;
  }
  function render() {
    const doc = root.document;
    if (!doc) return;
    observer?.disconnect();
    try {
      if (doc.documentElement) doc.documentElement.lang = locale;
      for (const id of liveIds) {
        const element = doc.querySelector('#'+id);
        if (element) element.setAttribute('data-i18n-live','');
      }
      for (const element of doc.querySelectorAll('[data-i18n]')) {
        const pair = table[element.dataset.i18n];
        if (pair) translateElement(element,pair[0]);
      }
      for (const attr of ['placeholder','aria-label','title']) {
        for (const element of doc.querySelectorAll('[data-i18n-'+attr+']')) {
          const token = element.getAttribute('data-i18n-'+attr);
          const pair = table[token];
          if (pair) element.setAttribute(attr,t(pair[0]));
        }
      }
      for (const element of doc.querySelectorAll('[data-i18n-live]')) {
        // Opt-in must never override a form value, editable title, or code.
        if (protectedText(element)) continue;
        const current = element.textContent;
        let previous = state.get(element);
        if (!previous || current !== previous.last) previous = { english:current };
        if (element.tagName.toLowerCase() === 'option' && !element.hasAttribute('value'))
          element.setAttribute('value',previous.english);
        const translated = t(previous.english);
        if (current !== translated) element.textContent = translated;
        state.set(element,{ english:previous.english,last:translated });
      }
      for (const button of doc.querySelectorAll('[data-ui-locale]'))
        button.setAttribute('aria-pressed',String(button.dataset.uiLocale === locale));
    } finally {
      observer?.observe(doc.body,{ childList:true,subtree:true,characterData:true });
    }
  }
  function setLocale(next) {
    if (!valid(next)) return false;
    locale = next;
    let saved = true;
    try { root.localStorage.setItem(key,locale); } catch { saved = false; }
    render();
    const status = root.document?.querySelector('#localeStatus');
    if (status) {
      status.dataset.state = saved ? '' : 'error';
      status.textContent = saved ? (locale === 'pl' ? 'Język interfejsu: polski.' : 'Interface language: English.') : locale === 'pl'
        ? 'Język zmieniony tylko w tej sesji — pamięć przeglądarki jest niedostępna.'
        : 'Language changed for this session only — browser storage is unavailable.';
    }
    return saved;
  }
  const api = { t,render,setLocale,valid,getLocale:()=>locale,key };
  root.VaultLocale = api;
  if (root.document) {
    for (const button of root.document.querySelectorAll('[data-ui-locale]'))
      button.onclick = () => setLocale(button.dataset.uiLocale);
    if (typeof root.MutationObserver === 'function') observer = new root.MutationObserver(render);
    render();
  }
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
