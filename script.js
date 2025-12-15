document.addEventListener('DOMContentLoaded', () => {
	const switchEl = document.getElementById('langSwitch');
	const aboutText = document.getElementById('aboutText');
	const aboutHeading = document.getElementById('aboutHeading');
	const bikeCanvas = document.querySelector('.bash-bike-code-animation');

	if (!switchEl || !aboutText || !aboutHeading) return;

	const setLanguage = () => {
		const isEng = switchEl.checked;
		const text = isEng ? aboutText.dataset.eng : aboutText.dataset.esp;
		const heading = isEng ? aboutHeading.dataset.eng : aboutHeading.dataset.esp;
		aboutText.textContent = text || '';
		aboutHeading.textContent = heading || '';
	};

	setLanguage();
	switchEl.addEventListener('change', setLanguage);

	// Update terminal time every second
	const terminalLine = document.querySelector('.terminal-line');
	if (terminalLine) {
		const updateTime = () => {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			terminalLine.textContent = `${hours}:${minutes}:${seconds} iker @ ~ $`;
		};
			updateTime();
		setInterval(updateTime, 1000);
	}

	// Typing animation for title
	const titleEl = document.getElementById('mainTitle');
	if (titleEl) {
		const text = 'IkerLopDev - Personal Site';
		let idx = 0;
		
		const typeChar = () => {
			if (idx < text.length) {
				titleEl.textContent += text[idx];
				idx++;
				setTimeout(typeChar, 100);
			}
		};
		
		typeChar();
	}
});
