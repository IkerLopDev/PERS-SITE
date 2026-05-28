document.addEventListener('DOMContentLoaded', () => {
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const langSwitch = document.getElementById('langSwitch');
	const langWrap = document.querySelector('.lang-switch');
	const clock = document.getElementById('clock');
	const yearEl = document.getElementById('year');

	const termOutput = document.getElementById('termOutput');
	const termForm = document.getElementById('termForm');
	const termInput = document.getElementById('termInput');
	const termChips = document.getElementById('termChips');
	const consolePanel = document.getElementById('console');

	const state = { lang: 'eng', history: [], histIdx: null };

	/* ---------- language ---------- */
	const applyLang = (isEng) => {
		state.lang = isEng ? 'eng' : 'esp';
		document.documentElement.lang = isEng ? 'en' : 'es';
		document.querySelectorAll('[data-eng]').forEach((el) => {
			el.textContent = isEng ? el.dataset.eng : el.dataset.esp;
		});
		if (langSwitch) langSwitch.checked = isEng;
		if (langWrap) langWrap.dataset.active = isEng ? 'eng' : 'esp';
	};

	if (langSwitch) {
		applyLang(langSwitch.checked);
		langSwitch.addEventListener('change', () => applyLang(langSwitch.checked));
	}

	/* ---------- clock + year ---------- */
	if (clock) {
		const tick = () => {
			const n = new Date();
			clock.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
				.map((x) => String(x).padStart(2, '0'))
				.join(':');
		};
		tick();
		setInterval(tick, 1000);
	}
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	/* ---------- certifications scroll ---------- */
	const certList = document.getElementById('certificationsList');
	const leftBtn = document.getElementById('scrollLeft');
	const rightBtn = document.getElementById('scrollRight');
	if (certList && leftBtn && rightBtn) {
		leftBtn.addEventListener('click', () => certList.scrollBy({ left: -240, behavior: 'smooth' }));
		rightBtn.addEventListener('click', () => certList.scrollBy({ left: 240, behavior: 'smooth' }));
	}

	/* ---------- terminal ---------- */
	if (!termOutput || !termForm || !termInput) return;

	const scrollOut = () => { termOutput.scrollTop = termOutput.scrollHeight; };

	const printLines = (lines) => {
		(lines || []).forEach((l) => {
			const div = document.createElement('div');
			div.className = 'line' + (l.cls ? ' ' + l.cls : '');
			if (l.html) div.innerHTML = l.html;
			else div.textContent = l.text;
			termOutput.appendChild(div);
		});
		scrollOut();
	};

	const printPrompt = (input) => {
		const div = document.createElement('div');
		div.className = 'line';
		const ps = document.createElement('span');
		ps.className = 'ps1';
		ps.textContent = 'iker@portfolio:~$ ';
		const cmd = document.createElement('span');
		cmd.className = 'line--cmd';
		cmd.textContent = input;
		div.append(ps, cmd);
		termOutput.appendChild(div);
		scrollOut();
	};

	const flash = (el) => {
		if (!el) return;
		el.classList.remove('flash');
		void el.offsetWidth;
		el.classList.add('flash');
	};
	const goSection = (id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
		flash(el);
	};

	/* ---------- commands ---------- */
	const projectCards = () => [...document.querySelectorAll('#projects .project-card')];

	const cmdHelp = () => [
		{ text: 'Available commands:', cls: 'line--accent' },
		{ text: '  about / whoami   bio' },
		{ text: '  projects         list projects ( open <n> )' },
		{ text: '  skills / stack   tech stack' },
		{ text: '  certs            achievements' },
		{ text: '  contact          links' },
		{ text: '  cv               résumé' },
		{ text: '  lang es | en     switch language' },
		{ text: '  clear            clear screen' },
	];

	const cmdAbout = () => {
		goSection('about');
		const t = document.getElementById('aboutText');
		return [{ text: t ? t.textContent.trim() : 'about: unavailable', cls: 'line--muted' }];
	};

	const cmdProjects = () => {
		goSection('projects');
		const lines = projectCards().map((c, i) => {
			const name = c.querySelector('h3').textContent.trim();
			const tags = [...c.querySelectorAll('.tags li')].map((t) => t.textContent).join(' · ');
			return { text: `  [${i + 1}] ${name}${tags ? '  — ' + tags : ''}` };
		});
		lines.push({ text: "  run 'open <n>' to view source", cls: 'line--muted' });
		return lines;
	};

	const cmdOpen = (args) => {
		const n = parseInt(args[0], 10);
		const card = projectCards()[n - 1];
		if (!card) return [{ text: `open: no project #${args[0] || ''}`, cls: 'line--err' }];
		const url = card.dataset.url;
		if (!url) return [{ text: `open: project #${n} has no source yet`, cls: 'line--err' }];
		window.open(url, '_blank', 'noopener');
		return [{ text: `opening ${url} ↗`, cls: 'line--accent' }];
	};

	const cmdSkills = () => {
		goSection('about');
		return [...document.querySelectorAll('#about .spec-row')].map((r) => {
			const dt = r.querySelector('dt').textContent.trim();
			const dd = r.querySelector('dd').textContent.trim();
			return { text: `  ${dt.padEnd(6)} ${dd}` };
		});
	};

	const cmdCerts = () => {
		goSection('achievements');
		return [...document.querySelectorAll('#certificationsList .cert-card')].map((c) => {
			const name = c.querySelector('.cert-name').textContent.trim();
			const issuer = c.querySelector('.cert-issuer').textContent.trim();
			return { text: `  ${name} — ${issuer}` };
		});
	};

	const cmdContact = () => {
		goSection('contact');
		return [...document.querySelectorAll('#contact .contact-row')].map((a) => {
			const label = a.querySelector('.contact-label').textContent.trim();
			const href = a.getAttribute('href');
			return { html: `  ${label}: <a href="${href}" target="_blank" rel="noreferrer">${href}</a>` };
		});
	};

	const cmdCv = () => [{ text: 'cv: not published yet — reach out via contact.', cls: 'line--muted' }];

	const cmdLang = (args) => {
		const a = (args[0] || '').toLowerCase();
		if (a === 'es' || a === 'esp') { applyLang(false); return [{ text: 'idioma: español', cls: 'line--accent' }]; }
		if (a === 'en' || a === 'eng') { applyLang(true); return [{ text: 'language: English', cls: 'line--accent' }]; }
		return [{ text: 'usage: lang es | en', cls: 'line--err' }];
	};

	const execute = (raw) => {
		const input = (raw || '').trim();
		if (!input) return;
		printPrompt(input);
		state.history.push(input);
		state.histIdx = null;

		const parts = input.split(/\s+/);
		const cmd = parts[0].toLowerCase();
		const args = parts.slice(1);

		switch (cmd) {
			case 'help': case '?': printLines(cmdHelp()); break;
			case 'about': case 'whoami': printLines(cmdAbout()); break;
			case 'projects': printLines(cmdProjects()); break;
			case 'ls':
				printLines(/^proj/i.test(args[0] || '') ? cmdProjects() : [{ text: 'about  projects  certs  contact', cls: 'line--muted' }]);
				break;
			case 'open': printLines(cmdOpen(args)); break;
			case 'skills': case 'stack': printLines(cmdSkills()); break;
			case 'certs': case 'certifications': case 'achievements': printLines(cmdCerts()); break;
			case 'contact': case 'links': printLines(cmdContact()); break;
			case 'cv': case 'resume': printLines(cmdCv()); break;
			case 'lang': printLines(cmdLang(args)); break;
			case 'clear': case 'cls': termOutput.innerHTML = ''; break;
			default: printLines([{ text: `command not found: ${cmd} — type 'help'`, cls: 'line--err' }]);
		}
	};

	/* ---------- input wiring ---------- */
	termForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const v = termInput.value;
		termInput.value = '';
		execute(v);
		termInput.focus();
	});

	termInput.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowUp') {
			if (!state.history.length) return;
			e.preventDefault();
			state.histIdx = state.histIdx === null ? state.history.length - 1 : Math.max(0, state.histIdx - 1);
			termInput.value = state.history[state.histIdx];
		} else if (e.key === 'ArrowDown') {
			if (state.histIdx === null) return;
			e.preventDefault();
			state.histIdx += 1;
			if (state.histIdx >= state.history.length) { state.histIdx = null; termInput.value = ''; }
			else termInput.value = state.history[state.histIdx];
		}
	});

	if (termChips) {
		termChips.addEventListener('click', (e) => {
			const btn = e.target.closest('.chip');
			if (!btn) return;
			execute(btn.dataset.cmd);
			termInput.focus();
		});
	}

	if (consolePanel) {
		consolePanel.addEventListener('click', (e) => {
			if (!e.target.closest('a, button, input')) termInput.focus();
		});
	}

	/* ---------- boot sequence ---------- */
	const boot = [
		{ text: 'booting field console …', cls: 'line--muted' },
		{ text: 'OS      : Infrastructure Engineer' },
		{ text: 'STACK   : Docker · Kubernetes · Python · Bash' },
		{ text: 'FOCUS   : scalable, secure systems' },
		{ text: "type 'help' to query the system.", cls: 'line--accent' },
	];

	if (prefersReduced) {
		printLines(boot);
	} else {
		termOutput.setAttribute('aria-busy', 'true');
		const typeLine = (l, done) => {
			const div = document.createElement('div');
			div.className = 'line' + (l.cls ? ' ' + l.cls : '');
			termOutput.appendChild(div);
			let j = 0;
			const id = setInterval(() => {
				j += 1;
				div.textContent = l.text.slice(0, j);
				scrollOut();
				if (j >= l.text.length) { clearInterval(id); setTimeout(done, 80); }
			}, 12);
		};
		const typeBoot = (i) => {
			if (i >= boot.length) { termOutput.setAttribute('aria-busy', 'false'); return; }
			typeLine(boot[i], () => typeBoot(i + 1));
		};
		typeBoot(0);
	}
});
