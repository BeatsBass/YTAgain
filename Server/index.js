const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const urlLib = require('url');
const https = require('https');

const app = express();

app.use(cors());

app.listen(4000, () => {
	console.log('Server Works !!! At port 4000');
});

app.get('/downloadmp3', async (req, res, next) => {
	try {
		var url = req.query.url;
		const video = ytdl(url, { range: { start: 0, end: 1000 } });
		let lenj = 0
		video.on('info', (info, format) => {
			console.log('hv', format)
			var parsed = urlLib.parse(format.url);
			parsed.method = 'HEAD';
			https.request(parsed, (res) => {
				lenj = res.headers['content-length'];
			}).end();
		});

		//res.set('content-length',`${lenj}`)
		res.set('content-type', 'audio/mp3')
		res.set('accept-ranges', 'bytes')
		video.pipe(res)
		/*ytdl(url, {
			format: 'mp4',
		}).pipe(res);*/

	} catch (err) {
		console.error(err);
	}
});


app.get('/downloadmp4', async (req, res, next) => {
	try {
		let URL = req.query.url;
		let title = 'video';
		let duration = '0';

		await ytdl.getBasicInfo(URL, {
			format: 'mp4'
		}, (err, info) => {
			title = info.player_response.videoDetails.title;
			duration = info.formats[0].contentLength
		});
		const me = (Number(duration) - 1) + ''
		//res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		/*res.set('content-length', duration)
		res.set('Content-Range', 'bytes 0-' + me + '/' + duration)
		res.set('content-type', 'audio/mp3')
		res.set('accept-ranges', 'bytes')
		ytdl(URL, {
			format: 'mp4',
		}).pipe(res);*/


		//tets

		const range = req.headers.range;
		const parts = range.replace(/bytes=/, '').split('-');
		const partialStart = parts[0];
		const partialEnd = parts[1];

		const start = parseInt(partialStart, 10);
		const end = partialEnd ? parseInt(partialEnd, 10) : Number(duration) - 1;
		const chunksize = (end - start) + 1;
		const rstream = ytdl(URL,{range:{ start: start, end: end }});

		res.writeHead(206, {
			'Content-Range': 'bytes ' + start + '-' + end + '/' + duration,
			'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
			'Content-Type': 'audio/mp3'
		});
		rstream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});