const $contenedor = document.getElementById('particles');

const generateParticles = () => {
	const cantidad = 50;
	
	for (let i = 0; i < cantidad; i++) {
		const $particula = document.createElement('div');
		$particula.classList.add('particle');
		
		const left = Math.random() * 100;
		const delay = Math.random() * 10;
		const duration = 10 + Math.random() * 10;
		
		$particula.style.left = `${left}vw`;
		$particula.style.animationDelay = `${delay}s`;
		$particula.style.animationDuration = `${duration}s`;
		
		$contenedor.appendChild($particula);
	}
}

export default generateParticles;