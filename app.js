/* George Town VR — single-file app logic. ponytail: hash router + template strings; split when a framework is already in the repo. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const STOPS = [
    { id: 0, key: 'street', en: 'Street Front', ms: 'Muka Jalan', url: 'https://www.mbpp.gov.my/', credit: 'Photo: Wikimedia Commons, CC BY-SA (see credits)' },
    { id: 1, key: 'workbench', en: 'Artisan’s Workbench', ms: 'Meja Tukang', url: 'https://www.penangheritage.com.my/', credit: 'Photo: Wikimedia Commons, CC BY-SA (see credits)' },
    { id: 2, key: 'courtyard', en: 'Inner Courtyard', ms: 'Laman Dalam', url: 'https://www.penangheritage.com.my/', credit: 'Photo: Wikimedia Commons, CC BY-SA (see credits)' }
  ];

  const T = {
    en: {
      htmlLang: 'en',
      brand: 'Step inside a George Town shophouse',
      lead: 'Three stops, one restored shophouse. Choose a stop, then walk the reconstruction, turn the plane, stand in the courtyard, hear the story, and test what you noticed.',
      stop: 'Selected stop', stops: 'Choose a stop', preview: 'Browser preview', vr: 'Enter VR', simVr: 'Enter Simulated VR', simExit: 'Exit Simulated VR', simLabel: 'SIMULATED VR · Desktop view', noVr: 'Headset mode needs WebXR. You can explore every scene here in the browser.',
      resume: 'Resume Trail', resumeHint: 'Saved progress on this device', start: 'Start the trail',
      experiences: 'Five experiences', back: 'Back to Explore', trailNav: 'Discovery Trail', progress: 'Trail progress',
      historyTitle: 'Historical Shophouse Reconstruction', historyLead: 'A fixed viewpoint on the street, facing the five-foot way. The reconstruction is an illustrative overlay on the present-day photograph, not a measured record.',
      present: 'Present Day', then: 'Historical Reconstruction', both: 'Compare', shutter: 'Timber shutter', shutterBody: 'Louvred timber slats above the five-foot way filter the glare and let air move through the upper room. Closed at midday, opened for the evening breeze. Illustrative reconstruction detail.', credit: 'Source credit', illustrative: 'Illustrative reconstruction · not surveyed, not archival',
      artifactTitle: 'Virtual Artifact Workbench', artifactLead: 'A carpenter’s wooden hand plane on the workbench. Drag the model to turn it, scroll or use the buttons to zoom.',
      rotate: 'Drag to rotate', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset', parts: 'Parts', handle: 'Handle', blade: 'Blade',
      handleBody: 'The rear tote is gripped with one hand and pushed away from the body. A hardwood body stays steady through the stroke.', bladeBody: 'The iron is set in the mouth and held by a wedge. A thin shaving means the cut is fine; the mouth breaks the shaving before it tears the grain.', pickPart: 'Choose a part to highlight it on the model',
      tourTitle: 'Guided Shophouse Tour', tourLead: 'Two viewpoints inside the same building. Choose a location; drag the view or use the arrows.', front: 'Front Room', court: 'Inner Courtyard', youAreHere: 'You are here', floorPlan: 'Floor plan', light: 'Courtyard opening', lightBody: 'The air well is open to the sky. Daylight falls down the shaft, reaches the dining room and rear rooms, and draws warm air up and out. That is why the inner rooms stay usable without windows to the street.', dragLook: 'Drag to look around', lookLeft: 'Look left', lookRight: 'Look right',
      storyTitle: 'Spatial Community Story', storyLead: 'A sample story, written for this prototype — not a resident interview.', fictional: 'Fictional sample narration', openStory: 'Open the story at the workbench', play: 'Play', pause: 'Pause', replay: 'Replay', captions: 'Captions', transcript: 'Full transcript', audioFail: 'Audio could not play here. The captions and transcript carry the full story.',
      trailTitle: 'Interactive Heritage Discovery Trail', trailLead: 'One observation task at each stop. Examine the evidence, answer one question, then continue.', task: 'Observation task', evidence: 'Examine Evidence', question: 'Your answer', submit: 'Submit answer', retry: 'Try Again', backEvidence: 'Back to the evidence', correct: 'Correct.', incorrect: 'Not quite.', continue: 'Continue', recap: 'Trail complete · 3 of 3', recapLead: 'You finished all three stops. Revisit any scene, or restart the trail.', revisit: 'Revisit scene', restart: 'Restart trail', locked: 'Answer correctly to unlock Continue', of: 'of',
      viewBtnPresent: 'Present', viewBtnThen: 'Reconstruction', viewBtnSplit: 'Compare', close: 'Close', lang: 'Language',
      trailStopPick: 'Trail stop'
    },
    ms: {
      htmlLang: 'ms',
      brand: 'Masuk ke dalam rumah kedai George Town',
      lead: 'Tiga perhentian, satu rumah kedai. Pilih perhentian, kemudian telusuri rekonstruksi, putar ketam kayu, berdiri di laman dalam, dengar kisahnya, dan uji apa yang anda perhatikan.',
      stop: 'Perhentian dipilih', stops: 'Pilih perhentian', preview: 'Pratonton pelayar', vr: 'Masuk VR', simVr: 'Masuk VR Simulasi', simExit: 'Keluar VR Simulasi', simLabel: 'VR SIMULASI · Paparan desktop', noVr: 'Mod headset memerlukan WebXR. Semua babak boleh diteroka di pelayar ini.',
      resume: 'Sambung Jejak', resumeHint: 'Kemajuan tersimpan pada peranti ini', start: 'Mulakan jejak',
      experiences: 'Lima pengalaman', back: 'Kembali ke Teroka', trailNav: 'Jejak Penemuan', progress: 'Kemajuan jejak',
      historyTitle: 'Rekonstruksi Rumah Kedai Bersejarah', historyLead: 'Sudut pandangan tetap di jalan, menghadap kaki lima. Rekonstruksi ini lapisan ilustratif pada foto hari ini, bukan rekod yang diukur.',
      shutter: 'Tingkap kayu', shutterBody: 'Jalur kayu di atas kaki lima menapis silau dan membenarkan udara mengalir ke bilik atas. Ditutup pada tengah hari, dibuka untuk angin petang. Butiran rekonstruksi ilustratif.', credit: 'Kredit sumber', illustrative: 'Rekonstruksi ilustratif · bukan tinjauan, bukan arkib',
      artifactTitle: 'Meja Kerja Artifak Maya', artifactLead: 'Ketam kayu tukang pada meja kerja. Seret model untuk memutarnya, tatal untuk zum atau guna butang.',
      rotate: 'Seret untuk memutar', zoomIn: 'Zum masuk', zoomOut: 'Zum keluar', reset: 'Set semula', parts: 'Bahagian', handle: 'Pemegang', blade: 'Mata ketam',
      handleBody: 'Pemegang belakang dipegang dengan satu tangan dan ditolak menjauhi badan. Badan kayu keras kekal mantap sepanjang tolakan.', bladeBody: 'Mata besi diletakkan di mulut ketam dan dipegang baji. Serutan nipis bermaksud potongan halus; mulut mematahkan serutan sebelum kayu terkoyak.',
      pickPart: 'Pilih bahagian untuk menyerlahkannya pada model',
      tourTitle: 'Lawatan Berpandu Rumah Kedai', tourLead: 'Dua sudut pandangan dalam bangunan yang sama. Pilih lokasi; seret pandangan atau guna anak panah.', front: 'Ruang Hadapan', court: 'Laman Dalam', youAreHere: 'Anda di sini', floorPlan: 'Pelan lantai', light: 'Bukaan laman', lightBody: 'Lubang udara terbuka ke langit. Cahaya turun ke ruang makan dan bilik belakang, dan menarik udara panas naik ke luar. Itulah sebabnya bilik dalam kekal boleh digunakan tanpa tingkap ke jalan.', dragLook: 'Seret untuk melihat sekeliling', lookLeft: 'Lihat kiri', lookRight: 'Lihat kanan',
      storyTitle: 'Kisah Komuniti Spatial', storyLead: 'Kisah contoh, ditulis untuk prototaip ini — bukan temu bual penduduk.', fictional: 'Naratif contoh fiksyen', openStory: 'Buka kisah di meja kerja', play: 'Main', pause: 'Jeda', replay: 'Ulang', captions: 'Sari kata', transcript: 'Transkrip penuh', audioFail: 'Audio tidak dapat dimainkan di sini. Sari kata dan transkrip membawa kisah penuh.',
      trailTitle: 'Jejak Penemuan Warisan Interaktif', trailLead: 'Satu tugasan pemerhatian di setiap perhentian. Teliti bukti, jawab satu soalan, kemudian teruskan.', task: 'Tugasan pemerhatian', evidence: 'Teliti Bukti', question: 'Jawapan anda', submit: 'Hantar jawapan', retry: 'Cuba Lagi', backEvidence: 'Kembali ke bukti', correct: 'Betul.', incorrect: 'Belum tepat.', continue: 'Teruskan', recap: 'Jejak selesai · 3 daripada 3', recapLead: 'Anda menamatkan ketiga-tiga perhentian. Lawati semula mana-mana babak, atau mula semula jejak.', revisit: 'Lawati semula babak', restart: 'Mula semula jejak', locked: 'Jawab dengan betul untuk membuka Teruskan', of: 'daripada',
      viewBtnPresent: 'Kini', viewBtnThen: 'Rekonstruksi', viewBtnSplit: 'Banding', close: 'Tutup', lang: 'Bahasa',
      trailStopPick: 'Perhentian jejak'
    }
  };

  const STOP_COPY = {
    en: [
      'The street front where the shophouse meets the five-foot way: louvred shutters, plaster, and a doorway that once doubled as a shop counter.',
      'Behind the front room, a carpenter’s bench under the air well. Tools, shavings, and the smell of resin.',
      'The open-to-sky courtyard that pulls daylight and air into the middle of a deep, narrow building.'
    ],
    ms: [
      'Muka jalan tempat rumah kedai bertemu kaki lima: tingkap kayu, lepa, dan pintu yang dahulu menjadi kaunter kedai.',
      'Di belakang ruang hadapan, bangku tukang di bawah lubang udara. Alatan, serutan, dan bau damar.',
      'Laman terbuka ke langit yang menarik cahaya dan udara ke tengah bangunan yang dalam dan sempit.'
    ]
  };

  /* Trail: task, evidence, question, options, correct index, explanation. */
  const TRAIL = {
    en: [
      { task: 'Look at the upper storey of the façade. Which material closes the window?', evidence: 'Photo and reconstruction both show louvred openings above the five-foot way. The slats are timber, set in a timber frame; plaster alone would seal the room.', evidenceTitle: 'Upper-storey shutters',
        q: 'What closes the upper-storey window?', o: ['Timber louvred shutters', 'Fixed glass panes', 'Rolled steel shutters'], a: 0,
        why: 'Correct. Timber louvres let air through while cutting the glare, which is why they were kept open in the evening.' },
      { task: 'On the workbench, find the part you push away from your body.', evidence: 'The rear tote stands proud of the body; the blade sits in the mouth in front of it. Gripping the tote keeps fingers clear of the iron.', evidenceTitle: 'Hand plane, from the rear',
        q: 'Which part do you grip to push the plane?', o: ['The iron', 'The rear handle', 'The wedge'], a: 1,
        why: 'Correct. The rear tote is the pushing grip; the iron and wedge are set in the body.' },
      { task: 'Stand in the courtyard and look up. Where does the light enter?', evidence: 'The courtyard is open to the sky. Daylight falls down the shaft into the dining room and rear rooms, and warm air escapes upward.', evidenceTitle: 'Air well, looking up',
        q: 'Why is the courtyard open to the sky?', o: ['To store rainwater only', 'To bring daylight and air into the inner rooms', 'To display a signboard'], a: 1,
        why: 'Correct. The air well is the building’s light and ventilation engine, not a decorative gap.' }
    ],
    ms: [
      { task: 'Perhatikan tingkat atas muka bangunan. Bahan apa menutup tingkap?', evidence: 'Foto dan rekonstruksi menunjukkan bukaan berjalur di atas kaki lima. Jalurnya kayu, dalam bingkai kayu; lepa sahaja akan menutup bilik.', evidenceTitle: 'Tingkap tingkat atas',
        q: 'Apa yang menutup tingkap tingkat atas?', o: ['Tingkap kayu berjalur', 'Kaca tetap', 'Pintu gulung besi'], a: 0,
        why: 'Betul. Jalur kayu membenarkan udara melaluinya sambil menapis silau, sebab itu ia dibuka pada waktu petang.' },
      { task: 'Di meja kerja, cari bahagian yang anda tolak menjauhi badan.', evidence: 'Pemegang belakang menonjol dari badan; mata ketam berada di mulut di hadapannya. Memegang pemegang menjauhkan jari daripada mata besi.', evidenceTitle: 'Ketam, dari belakang',
        q: 'Bahagian mana dipegang untuk menolak ketam?', o: ['Mata besi', 'Pemegang belakang', 'Baji'], a: 1,
        why: 'Betul. Pemegang belakang ialah pegangan tolakan; mata besi dan baji ditetapkan pada badan.' },
      { task: 'Berdiri di laman dalam dan lihat ke atas. Dari mana cahaya masuk?', evidence: 'Laman terbuka ke langit. Cahaya turun ke ruang makan dan bilik belakang, dan udara panas keluar ke atas.', evidenceTitle: 'Lubang udara, ke atas',
        q: 'Mengapa laman terbuka ke langit?', o: ['Hanya untuk menyimpan air hujan', 'Untuk membawa cahaya dan udara ke bilik dalam', 'Untuk memaparkan papan tanda'], a: 1,
        why: 'Betul. Lubang udara ialah enjin cahaya dan pengudaraan bangunan, bukan jurang hiasan.' }
    ]
  };

  const KEY = 'gtvr-v1';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  const state = {
    lang: saved.lang || 'en',
    stop: Number(saved.stop) || 0,
    completed: Array.isArray(saved.completed) ? saved.completed.filter((n) => n >= 0 && n < 3) : [],
    cursor: Number(saved.cursor) || 0,
    answers: saved.answers || {},
    trailTab: Number(saved.trailTab) || 0
  };
  const t = () => T[state.lang];
  const stopName = (i) => STOPS[i][state.lang === 'ms' ? 'ms' : 'en'];
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ lang: state.lang, stop: state.stop, completed: state.completed, cursor: state.cursor, answers: state.answers, trailTab: state.trailTab })); } catch {} }

  const esc2 = esc;
  const icon = {
    history: '<path d="M4 20V9l8-4 8 4v11H4Zm4-11v11m8-11v11M4 20h16M9 6h6"/>',
    artifact: '<path d="M3 15h18v4H3zM6 15V9h10v6M13 9l3-4h3"/>',
    tour: '<path d="M4 20V8l8-4 8 4v12M8 20v-7h8v7M8 9h1m3 0h1m3 0h1"/>',
    story: '<path d="M11 5v11a3 3 0 1 1-3-3h3m0 3V7l8-2v9M19 14a3 3 0 1 1-3-3h3"/>',
    trail: '<path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15c0-4 12-2 12-6"/>'
  };
  const cards = () => [
    { href: '#history', k: 'history', title: t().historyTitle, desc: t().historyLead },
    { href: '#artifact', k: 'artifact', title: t().artifactTitle, desc: t().artifactLead },
    { href: '#tour', k: 'tour', title: t().tourTitle, desc: t().tourLead },
    { href: '#story', k: 'story', title: t().storyTitle, desc: t().storyLead },
    { href: '#trail', k: 'trail', title: t().trailTitle, desc: t().trailLead }
  ];

  const backBtn = () => `<a class="back" href="#explore">← ${t().back}</a>`;

  function renderExplore() {
    const resumable = state.cursor < 3 && (state.completed.length > 0 || state.answers[state.cursor]);
    return `<section class="hero">
      <div class="hero-copy"><p class="eyebrow">GEORGE TOWN · PENANG · ${state.lang.toUpperCase()}</p>
        <h1>${t().brand}</h1><p class="lede">${t().lead}</p>
        <div class="actions"><a class="primary" href="#${resumable ? 'trail' : 'history'}">${resumable ? t().resume : t().start}</a><button id="vr" class="ghost" hidden aria-describedby="vr-note">${t().vr}</button><button id="sim-vr" class="ghost" hidden>${t().simVr}</button></div>
        <p class="hint" id="vr-note">${t().noVr}</p></div>
      <figure class="hero-photo"><img src="media/street.jpg" alt="Shophouse street front in George Town" width="900" height="600"><figcaption>${esc(STOPS[0].credit)}</figcaption></figure>
    </section>
    <section class="stopbar" aria-labelledby="stop-label"><h2 id="stop-label">${t().stops}</h2>
      <div class="stops">${STOPS.map((s, i) => `<button data-select-stop="${i}" aria-pressed="${i === state.stop}" class="stop${i === state.stop ? ' on' : ''}"><small>0${i + 1}</small><span>${esc(stopName(i))}</span></button>`).join('')}</div>
      <div class="selected"><p class="eyebrow">${t().stop}</p><h3>${esc(stopName(state.stop))}</h3><p>${STOP_COPY[state.lang][state.stop]}</p>
      ${resumable ? `<a class="resume" id="resume" href="#trail">${t().resume} · ${state.completed.length} ${t().of} 3 <small>${t().resumeHint}</small></a>` : ''}</div>
    </section>
    <section class="experiences" aria-label="${t().experiences}"><h2>${t().experiences}</h2>
      <div class="grid">${cards().map((c, i) => `<a class="experience" href="${c.href}"><svg viewBox="0 0 24 24" aria-hidden="true">${icon[c.k]}</svg><small>0${i + 1}</small><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><span class="go">${state.lang === 'ms' ? 'Buka' : 'Open'} →</span></a>`).join('')}</div>
    </section>`;
  }

  function renderHistory() {
    return `${backBtn()}<header class="page"><p class="eyebrow">02 · ${esc(stopName(0))}</p><h1>${t().historyTitle}</h1><p class="lede">${t().historyLead}</p></header>
    <section class="panel compare-panel">
      <div class="compare-toolbar" role="group" aria-label="${t().both}"><button data-view="0">${t().viewBtnPresent}</button><button data-view="50" aria-pressed="true">${t().viewBtnThen}</button><button data-view="100">${t().both}</button></div>
      <div class="comparison" style="--split:50%">
        <img class="now" src="media/street.jpg" alt="Present-day street front">
        <div class="then-wrap"><img src="media/then.jpg" alt="Illustrative historical reconstruction of the same street front"></div>
        <div class="divider" id="divider"><span></span></div>
        <span class="tag left">${t().present}</span><span class="tag right">${t().then}</span>
        <button id="shutter" class="hotspot" aria-describedby="note"><b>1</b></button>
      </div>
      <label class="slider"><span>${t().both}</span><input id="compare" type="range" min="0" max="100" value="50" step="1" aria-label="${t().both}"></label>
      <p class="hint">${t().illustrative}</p>
      <div class="note" id="note" role="status"><strong>${t().shutter}</strong><span>${t().shutterBody}</span><a href="media/CREDITS.txt">${t().credit}</a></div>
    </section>
    ${vrRow('history')}`;
  }

  const vrRow = (ctx) => `<section class="panel vrrow"><div><h2>${t().vr}</h2><p>${t().noVr}</p></div><button id="vr2" class="primary" hidden data-ctx="${ctx}">${t().vr}</button><button id="sim-vr2" class="primary" hidden>${t().simVr}</button></section>`;

  function renderArtifact() {
    return `${backBtn()}<header class="page"><p class="eyebrow">03 · ${esc(stopName(1))}</p><h1>${t().artifactTitle}</h1><p class="lede">${t().artifactLead}</p></header>
    <section class="panel split">
      <div class="scene" id="scene" tabindex="0" role="application" aria-label="${t().rotate} · ${t().pickPart}"><canvas id="stage" width="900" height="620"></canvas><span class="tag">${t().rotate}</span><div class="scene-tools"><button data-model="zoom-in" aria-label="${t().zoomIn}">+</button><button data-model="zoom-out" aria-label="${t().zoomOut}">−</button><button data-model="reset">${t().reset}</button></div></div>
      <div class="side"><h2>${t().parts}</h2><p class="hint">${t().pickPart}</p>
        <div class="partlist">${['handle', 'blade'].map((p, i) => `<button data-part="${p}" aria-pressed="false"><b>${i + 1}</b><span>${t()[p]}</span><span class="chev">›</span></button>`).join('')}</div>
        <div class="note" id="note" role="status"><strong>${t().handle}</strong><span>${t().handleBody}</span></div>
      </div>
    </section>${vrRow('artifact')}`;
  }

  function renderTour() {
    return `${backBtn()}<header class="page"><p class="eyebrow">04 · ${esc(stopName(2))}</p><h1>${t().tourTitle}</h1><p class="lede">${t().tourLead}</p></header>
    <section class="panel split">
      <div class="scene tour" id="scene" tabindex="0" role="application" aria-label="${t().dragLook}"><canvas id="stage" width="900" height="620"></canvas><span class="tag" id="place">${t().front}</span><div class="scene-tools"><button data-look="left" aria-label="${t().lookLeft}">←</button><button data-look="right" aria-label="${t().lookRight}">→</button></div><button class="hotspot" id="light-hotspot" data-light aria-describedby="note"><b>1</b></button></div>
      <div class="side"><h2>${t().floorPlan}</h2>
        <svg class="plan" viewBox="0 0 300 150" role="img" aria-label="${t().floorPlan}"><rect x="6" y="10" width="288" height="120" rx="2"/><line x1="110" y1="10" x2="110" y2="130"/><line x1="205" y1="10" x2="205" y2="130"/><rect class="well" x="205" y="10" width="38" height="52"/><text x="58" y="76">${t().front}</text><text x="157" y="76">${t().court}</text></svg>
        <div class="roomlist">${[0, 1].map((r) => `<button data-room="${r}" aria-pressed="${r === 0}"><b>${r === 0 ? '1' : '2'}</b><span>${r === 0 ? t().front : t().court}</span><small>${r === 0 ? t().youAreHere : ''}</small></button>`).join('')}</div>
        <div class="note" id="note" role="status"><strong>${t().light}</strong><span>${t().lightBody}</span></div>
      </div>
    </section>${vrRow('tour')}`;
  }

  function renderStory() {
    const lines = (window.Story && window.Story[state.lang]) || [
      'The doorway was the edge of two worlds — the street outside, the workbench inside.',
      'I kept the shutters half closed at noon, so the room held its shade.',
      'By four the courtyard took over, pulling light down into the middle of the house.',
      'This is a sample story, written for the prototype.'
    ];
    return `${backBtn()}<header class="page"><p class="eyebrow">05 · ${esc(stopName(1))}</p><h1>${t().storyTitle}</h1><p class="lede">${t().storyLead}</p><span class="badge">${t().fictional}</span></header>
    <section class="panel split">
      <div class="scene story" id="scene"><img src="media/street.jpg" alt="Workbench and doorway where the story opens"><div class="dim"></div><button class="hotspot" id="story-hotspot" aria-describedby="note"><b>1</b></button><span class="tag">${t().openStory}</span></div>
      <div class="side"><div class="note" id="note" role="status"><strong>${t().openStory}</strong><span>${t().handleBody}</span></div>
        <h2>${t().captions}</h2>
        <div class="audio-bar"><button id="play" class="primary">${t().play}</button><button id="replay" class="ghost">${t().replay}</button><audio id="audio" preload="metadata" src="media/story-${state.lang}.mp3"></audio></div>
        <p class="caption" id="caption" aria-live="polite">${t().play} ›</p>
        <p class="hint" id="audio-note" hidden>${t().audioFail}</p>
        <details><summary>${t().transcript}</summary><div id="transcript">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
        <p class="hint">${t().fictional}</p></details>
      </div>
    </section>${vrRow('story')}`;
  }

  function trailIndex() { const pending = [0, 1, 2].filter((n) => !state.completed.includes(n)); return pending.includes(state.trailTab) ? state.trailTab : (pending[0] ?? 2); }

  function renderTrail() {
    const done = state.completed.length;
    if (done === 3) return `${backBtn()}<header class="page"><p class="eyebrow">06 · ${t().trailTitle}</p><h1 id="progress">${t().recap}</h1><p class="lede">${t().recapLead}</p></header>
      <section class="panel"><div class="stops trail-stops">${STOPS.map((s, i) => `<a class="stop done" href="${['#history', '#artifact', '#tour'][i]}"><small>✓</small><span>${esc(stopName(i))}</span><em>${t().revisit}</em></a>`).join('')}</div>
      <div class="recap">${STOPS.map((s, i) => `<a href="${['#history', '#artifact', '#tour'][i]}">${esc(stopName(i))} →</a>`).join('')}</div>
      <button id="restart" class="ghost">${t().restart}</button></section>`;
    const idx = trailIndex(), d = TRAIL[state.lang][idx], ans = state.answers[idx];
    const submitted = ans !== undefined && ans !== null;
    const ok = submitted && ans === d.a;
    return `${backBtn()}<header class="page"><p class="eyebrow">06 · ${t().trailTitle}</p><h1 id="progress">${t().progress} · ${done} ${t().of} 3</h1><p class="lede">${t().trailLead}</p></header>
    <div class="stops trail-stops" role="tablist">${STOPS.map((s, i) => `<button role="tab" data-trail-stop="${i}" aria-selected="${i === idx}" class="stop${state.completed.includes(i) ? ' done' : ''}${i === idx ? ' on' : ''}"><small>${state.completed.includes(i) ? '✓' : '0' + (i + 1)}</small><span>${esc(stopName(i))}</span></button>`).join('')}</div>
    <section class="panel" id="trail-stop"><p class="eyebrow">${t().trailStopPick} ${idx + 1} · ${esc(stopName(idx))}</p><h2>${t().task}</h2><p>${esc(d.task)}</p>
      <button class="ghost" data-evidence>${t().evidence}</button>
      <fieldset class="q"><legend>${t().question}</legend>${d.o.map((o, i) => `<label class="opt${submitted ? (i === d.a ? ' correct' : '') : ''}${submitted && ans === i && !ok ? ' wrong' : ''}"><input type="radio" name="answer" value="${i}" ${ans === i ? 'checked' : ''} ${ok ? 'disabled' : ''}><span>${esc(o)}</span></label>`).join('')}</fieldset>
      ${ok ? `<p class="feedback ok" id="feedback"><strong>${t().correct}</strong> ${esc(d.why)}</p><a class="primary" id="continue" href="#trail">${t().continue} →</a>`
        : `<div class="actions"><button id="submit" class="primary" ${submitted ? 'hidden' : ''}>${t().submit}</button>${submitted ? `<p class="feedback no" id="feedback"><strong>${t().incorrect}</strong> ${esc(d.why)}</p><button id="retry" class="ghost">${t().retry}</button><button id="again-evidence" class="link" data-evidence>${t().backEvidence}</button>` : ''}</div>`}
      <p class="hint">${t().locked}</p>
    </section>`;
  }

  const ROUTES = { explore: renderExplore, history: renderHistory, artifact: renderArtifact, tour: renderTour, story: renderStory, trail: renderTrail };
  let scene = null;
  function destroyScene() { if (scene) { try { scene.destroy(); } catch {} scene = null; } }
  function route() { return (location.hash.replace('#', '') || 'explore').split('?')[0]; }

  function paint() {
    destroyScene();
    const r = ROUTES[route()] ? route() : 'explore';
    document.documentElement.lang = t().htmlLang;
    $('#main').innerHTML = ROUTES[r]();
    $('#main').scrollTop = 0;
    window.scrollTo(0, 0);
    $$('.experience').forEach((a) => { if (a.getAttribute('href') === '#' + r) a.setAttribute('aria-current', 'page'); });
    $$('header nav a').forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#explore' && r === 'explore' ? 'page' : a.getAttribute('href') === '#trail' && r === 'trail' ? 'page' : 'false'));
    wire(r);
    checkVR();
  }

  function wire(r) {
    if (r === 'explore') {
      $$('[data-select-stop]').forEach((b) => b.addEventListener('click', () => { state.stop = Number(b.dataset.selectStop); save(); paint(); }));
    }
    if (r === 'history') {
      const comp = $('.comparison'), range = $('#compare'), divider = $('#divider');
      const set = (v) => { range.value = v; comp.style.setProperty('--split', v + '%'); $$('.compare-toolbar button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === String(v))); };
      range.addEventListener('input', () => set(range.value));
      $$('.compare-toolbar button').forEach((b) => b.addEventListener('click', () => set(b.dataset.view)));
      let drag = false;
      const move = (e) => { if (!drag) return; const x = (e.touches ? e.touches[0].clientX : e.clientX) - comp.getBoundingClientRect().left; set(Math.max(0, Math.min(100, (x / comp.clientWidth) * 100))); e.preventDefault(); };
      divider.addEventListener('pointerdown', (e) => { drag = true; divider.setPointerCapture(e.pointerId); });
      divider.addEventListener('pointermove', move);
      divider.addEventListener('pointerup', () => { drag = false; });
      divider.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') set(Math.max(0, +range.value - 5)); if (e.key === 'ArrowRight') set(Math.min(100, +range.value + 5)); });
      divider.tabIndex = 0; divider.setAttribute('role', 'slider'); divider.setAttribute('aria-label', t().both);
      $('#shutter').addEventListener('click', () => { const n = $('#note'); n.classList.add('pulse'); n.scrollIntoView({ block: 'nearest' }); });
    }
    if (r === 'artifact' || r === 'tour') mountScene(r);
    if (r === 'story') wireStory();
    if (r === 'trail') wireTrail();
    $$('[id^="vr"]').forEach((b) => b.addEventListener('click', enterVR));
    $$('[id^="sim-vr"]').forEach((b) => b.addEventListener('click', toggleSimVR));
    if (document.body.classList.contains('simulated-vr')) addSimVRControls();
  }

  function mountScene(kind) {
    const el = $('#scene');
    if (!window.Heritage3D) { el.insertAdjacentHTML('beforeend', `<p class="fallback">${state.lang === 'ms' ? 'Pemapar 3D tidak tersedia.' : '3D viewer unavailable.'}</p>`); return; }
    try {
      scene = window.Heritage3D.mount(el.querySelector('canvas'), {
        kind: kind === 'artifact' ? 'artifact' : 'tour',
        stop: kind === 'artifact' ? 1 : state.stop,
        room: 0,
        onPart: (p) => setPart(p),
        onLight: () => { const n = $('#note'); n.classList.add('pulse'); }
      });
    } catch (e) { console.error(e); }
    if (kind === 'artifact') {
      $$('[data-model]').forEach((b) => b.addEventListener('click', () => { const a = b.dataset.model; if (a === 'reset') scene && scene.reset(); else scene && scene.zoom(a === 'zoom-in' ? 1.15 : 1 / 1.15); }));
      $$('[data-part]').forEach((b) => b.addEventListener('click', () => setPart(b.dataset.part)));
      const s = $('#scene');
      s.addEventListener('pointerdown', (e) => { s.dataset.drag = '1'; s.dataset.x = e.clientX; s.dataset.y = e.clientY; s.setPointerCapture(e.pointerId); });
      s.addEventListener('pointermove', (e) => { if (s.dataset.drag !== '1' || !scene) return; scene.move(e.clientX - s.dataset.x, e.clientY - s.dataset.y); s.dataset.x = e.clientX; s.dataset.y = e.clientY; });
      s.addEventListener('pointerup', () => { s.dataset.drag = '0'; });
      s.addEventListener('wheel', (e) => { e.preventDefault(); scene && scene.zoom(e.deltaY < 0 ? 1.06 : 1 / 1.06); }, { passive: false });
      s.addEventListener('keydown', (e) => {
        const k = { ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[e.key];
        if (k && scene) { scene.move(...k); e.preventDefault(); }
      });
    } else {
      $$('[data-room]').forEach((b) => b.addEventListener('click', () => {
        const n = Number(b.dataset.room);
        $$('[data-room]').forEach((o) => { o.setAttribute('aria-pressed', o === b); o.querySelector('small').textContent = o === b ? t().youAreHere : ''; });
        $('#place').textContent = n ? t().court : t().front;
        scene && scene.room(n);
      }));
      $$('[data-look]').forEach((b) => b.addEventListener('click', () => scene && scene.move(b.dataset.look === 'left' ? -40 : 40, 0)));
      $('#light-hotspot').addEventListener('click', () => { const n = $('#note'); n.classList.add('pulse'); n.scrollIntoView({ block: 'nearest' }); });
      const s = $('#scene');
      let down = false, lx = 0;
      s.addEventListener('pointerdown', (e) => { down = true; lx = e.clientX; s.setPointerCapture(e.pointerId); });
      s.addEventListener('pointermove', (e) => { if (!down || !scene) return; scene.move(e.clientX - lx, 0); lx = e.clientX; });
      s.addEventListener('pointerup', () => { down = false; });
      s.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft' && scene) scene.move(-30, 0); if (e.key === 'ArrowRight' && scene) scene.move(30, 0); });
    }
  }

  function setPart(p) {
    if (!p) return;
    if (scene && scene.part) scene.part(p);
    $$('[data-part]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.part === p));
    const n = $('#note'); if (!n) return;
    n.innerHTML = `<strong>${t()[p]}</strong><span>${t()[p + 'Body']}</span>`;
    n.classList.add('pulse');
  }

  let audioWired = false;
  function wireStory() {
    const audio = $('#audio'), btn = $('#play'), cap = $('#caption');
    audioWired = false;
    const setBtn = (playing) => { btn.textContent = playing ? t().pause : t().play; };
    btn.addEventListener('click', () => { if (audio.paused) audio.play().catch(() => { $('#audio-note').hidden = false; }); else audio.pause(); });
    $('#replay').addEventListener('click', () => { audio.currentTime = 0; audio.play().catch(() => { $('#audio-note').hidden = false; }); });
    audio.addEventListener('play', () => setBtn(true));
    audio.addEventListener('pause', () => setBtn(false));
    audio.addEventListener('error', () => { $('#audio-note').hidden = false; });
    $('#story-hotspot').addEventListener('click', () => { $('#note').classList.add('pulse'); audio.play().catch(() => { $('#audio-note').hidden = false; }); });
    const lines = (window.Story && window.Story[state.lang]) || [];
    audio.addEventListener('timeupdate', () => {
      const times = window.StoryTimes && window.StoryTimes[state.lang];
      let i = 0;
      if (times && times.length === lines.length) { for (let k = 0; k < times.length; k++) if (audio.currentTime >= times[k]) i = k; }
      else if (lines.length) i = Math.min(lines.length - 1, Math.floor((audio.currentTime / (audio.duration || 30)) * lines.length));
      if (lines[i]) cap.textContent = lines[i];
    });
  }

  function wireTrail() {
    const idx = trailIndex(), d = TRAIL[state.lang][idx];
    $$('[data-trail-stop]').forEach((b) => b.addEventListener('click', () => { state.trailTab = Number(b.dataset.trailStop); save(); paint(); }));
    $$('[data-evidence]').forEach((b) => b.addEventListener('click', () => { $('#evidence-content').innerHTML = `<h2>${esc(d.evidenceTitle)}</h2><p>${esc(d.evidence)}</p><p class="hint">${t().illustrative}</p>`; $('#evidence').showModal(); }));
    $('#close-evidence').addEventListener('click', () => $('#evidence').close());
    const submit = $('#submit');
    if (submit) submit.addEventListener('click', () => {
      const picked = $('input[name="answer"]:checked');
      if (!picked) return;
      state.answers[idx] = Number(picked.value);
      if (Number(picked.value) === d.a && !state.completed.includes(idx)) { state.completed.push(idx); state.completed.sort(); state.cursor = state.completed.length; }
      save(); paint();
    });
    if ($('#retry')) $('#retry').addEventListener('click', () => { delete state.answers[idx]; save(); paint(); });
    if ($('#continue')) $('#continue').addEventListener('click', (e) => {
      e.preventDefault();
      const next = [0, 1, 2].find((n) => !state.completed.includes(n));
      if (next !== undefined) state.trailTab = next;
      save(); paint();
    });
    if ($('#restart')) $('#restart').addEventListener('click', () => { state.completed = []; state.answers = {}; state.cursor = 0; state.trailTab = 0; save(); paint(); });
  }

  async function checkVR() {
    let ok = false;
    try { ok = !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-vr')); } catch { ok = false; }
    const vr = $('#vr'), sim = $('#sim-vr');
    if (vr) vr.hidden = !ok;
    if (sim) sim.hidden = ok;
    $$('.vrrow').forEach((row) => { row.querySelector('p').textContent = ok ? t().vr : t().noVr; });
  } const toggleSimVR = () => { const on = document.body.classList.toggle('sim-vr'); $('#sim-vr').textContent = on ? t().simExit : t().simVr; }; window.toggleSimVR = toggleSimVR;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('sim-vr')) toggleSimVR(); });
  const originalPaint = paint; paint = (...args) => { originalPaint(...args); const sim = $('#sim-vr'); if (sim) { sim.hidden = false; sim.textContent = document.body.classList.contains('sim-vr') ? t().simExit : t().simVr; sim.onclick = toggleSimVR; } };

  async function enterVR() {
    if (!window.Heritage3D || !window.Heritage3D.enter) return;
    try {
      await window.Heritage3D.enter({
        stop: state.stop, lang: state.lang,
        storyUrl: `media/story-${state.lang}.mp3`,
        onEnd: () => {}, onView: () => {},
        labels: { exit: state.lang === 'ms' ? 'Keluar VR' : 'Exit VR', next: state.lang === 'ms' ? 'Seterusnya' : 'Next' }
      });
    } catch (e) { console.warn('VR entry failed', e); }
  }

  $('#language').value = state.lang;
  $('#language').addEventListener('change', (e) => { state.lang = e.target.value; save(); paint(); });
  window.addEventListener('hashchange', paint);
  paint();
  window.__gtvr = { state, route, paint };
})();
