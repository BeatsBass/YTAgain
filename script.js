let Btn = document.getElementById('btn');
let URLinput = document.querySelector('.URL-input');
let select = document.querySelector('.opt');
let serverURL = 'http://localhost:4000';

Btn.addEventListener('click', () => {
	if (!URLinput.value) {
		alert('Enter YouTube URL');
	} else {
		//if (select.value == 'mp3') {
		//	redirectMp3(URLinput.value);
		//} else if (select.value == 'mp4') {
			redirectMp4(URLinput.value);
		//}
	}
});



function redirectMp4(query) {
	//window.location.href = `${serverURL}/downloadmp4?url=${query}`;
	const root = document.querySelector("#root");
	root.innerHTML = `<audio id="audio-player" controls="controls" autoplay src="${serverURL}/downloadmp4?url=${query}">`;
}