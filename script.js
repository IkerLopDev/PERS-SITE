document.addEventListener('DOMContentLoaded', () => {
	const switchEl = document.getElementById('langSwitch');
	const aboutText = document.getElementById('aboutText');
	const aboutHeading = document.getElementById('aboutHeading');

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
});
