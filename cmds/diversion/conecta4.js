const { Connect4, Connect4AI } = require('connect4-ai');
const { MessageAttachment } = require('discord.js-light');

/**@type {Map<string, Map<string, (0|1)>>} */
const turnosPorId = new Map();

/**
 * 
 * @param {object} obj
 * @param {string} obj.guild
 * @param {string} obj.member
 * @returns 
 */
function obtenerTurno(obj) {

	return turnosPorId.get(obj.guild) ? turnosPorId.get(obj.guild).get(obj.member) : null

}

const { sendEmbed, displayConnectFourBoard, awaitMessage } = require('../../Utils/Functions');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "conecta4"
		this.alias = [`connect4`, 'fourinrow', '4enlinea', 'c4']
		this.category = 'diversion'
	}
	/**
	* @param {object} obj
	* @param { import('discord.js-light').Message } obj.message
	* @param {import('discord.js-light').Client} obj.client
	* @param {Array<String>} obj.args
	*/

	async run(obj) {

		const { message, client, args } = obj;

		client.turnos = turnosPorId;

		if (message.guild.game)
			return sendEmbed({ channel: message.channel, description: '<:cancel:804368628861763664> | Hay una partida en curso en este servidor.' })

		let usuario = ['easy', 'medium', 'hard'].includes(args[0]?.toLowerCase()) ? client.user : message.mentions.users.first();

		if (!usuario || usuario.id == message.author.id || (usuario.bot && usuario.id != client.user.id))
			return sendEmbed({
				channel: message.channel,
				description: `<:cancel:804368628861763664> | Menciona a un miembro para jugar.`,
				footerText: 'Tambien puedes jugar con Zenitsu poniendo z!connect4 easy/medium/hard'
			});
		let turno = (id) => obtenerTurno({ guild: message.guild.id, member: id })
		if (usuario.id != client.user.id) {


			if (obtenerTurno({ guild: message.guild.id, member: usuario })) {
				return sendEmbed({
					channel: message.channel,
					description: `${usuario.tag} está activo en otra partida.`
				});
			}

			if (obtenerTurno({ guild: message.guild.id, member: message.author.id })) {
				return sendEmbed({
					channel: message.channel,
					description: `${message.author.tag} estas activo en otra partida.`
				});
			}

			message.guild.game = new Connect4();
			message.guild.game.jugadores = [message.author.id, usuario.id];
			let obj = new Map();
			turnosPorId.set(message.guild.id, obj)
			await sendEmbed({
				channel: message.channel,
				description: `<a:waiting:804396292793040987> | ${usuario} tienes 1 minuto para responder...\n¿Quieres jugar?: ~~responde "s"~~\n¿No quieres?: ~~responde "n"~~`
			});

			let respuesta = await awaitMessage({ channel: message.channel, filter: (m) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => { })

			if (!respuesta) {
				message.guild.game = undefined;
				turnosPorId.delete(message.guild.id)
				return sendEmbed({
					channel: message.channel,
					description: `😔 | ${usuario} no respondió...`
				})
			}

			if (respuesta.first().content == 'n') {
				message.guild.game = undefined;
				turnosPorId.delete(message.guild.id)
				return sendEmbed({
					channel: message.channel,
					description: '😔 | Rechazó la invitación...'
				})
			}

			if (obtenerTurno({ guild: message.guild.id, member: usuario.id })) {
				message.guild.game = undefined;
				return sendEmbed({
					channel: message.channel,
					description: `${usuario.tag} está activo en otra partida.`
				});
			}

			if (obtenerTurno({ guild: message.guild.id, member: message.author.id })) {
				message.guild.game = undefined;
				return sendEmbed({
					channel: message.channel,
					description: `${message.author.tag} estas activo en otra partida.`
				});
			}

			let temp = turnosPorId.get(message.guild.id);
			temp.set(usuario.id, Math.floor(Math.random() * 2) + 1);
			temp.set(message.author.id, temp.get(usuario.id) == 2 ? 1 : 2);

			let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes);
			let att = new MessageAttachment(res, '4enraya.gif')

			sendEmbed({
				attachFiles: att,
				channel: message.channel,
				imageURL: 'attachment://4enraya.gif',
				description: `🤔 | Empieza ${(turno(message.author.id)) == 1 ? message.author.tag : usuario.tag}, elige un numero del 1 al 7. [\`🔴\`]`
			})

			const colector = message.channel.createMessageCollector(msg => msg.guild.game.jugadores.includes(msg.author.id) && turno(msg.author.id) === msg.guild.game.gameStatus().currentPlayer && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 7) && message.guild.game.canPlay(parseInt(msg.content) - 1) && !message.guild.game.gameStatus().gameOver || (msg.guild.game.jugadores.includes(msg.author.id) && msg.content == 'surrender'), { idle: (3 * 60) * 1000, time: (30 * 60) * 1000 });

			colector.on('collect', async (msg) => {

				if (msg.content === 'surrender')
					return colector.stop('SURRENDER');

				msg.guild.game.play(parseInt(msg.content) - 1)
				if (msg.guild.game.gameStatus().gameOver && msg.guild.game.gameStatus().solution) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						description: `<:zsUHHHHHH:649036589195853836> | ${msg.author.tag} ha ganado la partida!`,
						channel: msg.channel,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif'
					})
					turnosPorId.delete(message.guild.id)
					msg.guild.game = undefined;
					return colector.stop();
				}

				else if (msg.guild.game.gameStatus().gameOver) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						channel: msg.channel,
						description: `<:wtfDuddd:797933539454091305> | Un empate entre ${usuario.tag} y ${message.author.tag}!`,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif'
					})
					turnosPorId.delete(message.guild.id)
					msg.guild.game = undefined;
					return colector.stop();
				}

				let res = await displayConnectFourBoard(displayBoard(msg.guild.game.ascii()), msg.guild.game, client.imagenes);
				let att = new MessageAttachment(res, '4enraya.gif')

				await sendEmbed({
					channel: msg.channel,
					attachFiles: att,
					description: `😆 | Turno de ${turno(message.author.id) == turno(msg.author.id) ? usuario.tag : message.author.tag} [${turno(msg.author.id) == 2 ? "`🔴`" : "`🟡`"}]`,
					imageURL: 'attachment://4enraya.gif'
				})
			})
			colector.on('end', async (_, r) => {

				if (r === 'SURRENDER' && message.guild.game) {
					sendEmbed({
						channel: message.channel,
						description: `<:wtfDuddd:797933539454091305> | Juego terminado...`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif'
					})
					turnosPorId.delete(message.guild.id)
					return message.guild.game = undefined;
				}

				else if (r === 'idle' && message.guild.game) {
					sendEmbed({
						channel: message.channel,
						description: `<:dislike1:369553357377110027> | Duraste tres minutos sin responder, juego terminado!`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif'
					})
					turnosPorId.delete(message.guild.id)
					return message.guild.game = undefined;
				}

				else if (message.guild.game && r === 'time') {
					sendEmbed({
						channel: message.channel,
						description: `<:dislike1:369553357377110027> | Ya pasaron 30 minutos, juego terminado!`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif'
					})
					turnosPorId.delete(message.guild.id)
					return message.guild.game = undefined;
				}
			})
		}

		else {

			const difficulty = ["hard", "medium", "easy"].includes(args[0]?.toLowerCase()) ? args[0]?.toLowerCase() : "medium";
			message.guild.game = new Connect4AI();
			message.guild.game.jugadores = [message.author.id, client.user.id]
			if (turno(message.author.id)) {
				message.guild.game = undefined;
				return sendEmbed({
					channel: message.channel,
					description: `${message.author.tag} estas activo en otra partida.`
				});
			}

			let obj = new Map();
			turnosPorId.set(message.guild.id, obj)
			turnosPorId.get(message.guild.id).set(message.author.id, 1)

			let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes);
			let att = new MessageAttachment(res, '4enraya.gif')
			sendEmbed({
				attachFiles: att,
				channel: message.channel,
				imageURL: 'attachment://4enraya.gif',
				description: `🤔 | Empieza ${message.author.tag}, elige un numero del 1 al 7. [\`🔴\`]`,
				footerText: difficulty
			})

			const colector = message.channel.createMessageCollector(msg => msg.author.id == message.author.id && turno(msg.author.id) === msg.guild.game.gameStatus().currentPlayer && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 7) && message.guild.game.canPlay(parseInt(msg.content) - 1) && !message.guild.game.gameStatus().gameOver || (msg.guild.game.jugadores.includes(msg.author.id) && msg.content == 'surrender'), { idle: (3 * 60) * 1000, time: (30 * 60) * 1000 });

			colector.on('collect', async (msg) => {

				if (msg.content === 'surrender')
					return colector.stop('SURRENDER');

				msg.guild.game.play(parseInt(msg.content) - 1)
				if (msg.guild.game.gameStatus().gameOver && msg.guild.game.gameStatus().solution) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						description: `<:zsUHHHHHH:649036589195853836> | ${message.author.tag} ha ganado la partida!`,
						channel: msg.channel,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { ganadas: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					msg.guild.game = undefined;
					return colector.stop();
				}

				else if (msg.guild.game.gameStatus().gameOver) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						channel: msg.channel,
						description: `<:wtfDuddd:797933539454091305> | Un empate entre ${message.author.tag} y ${client.user.tag}!`,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					msg.guild.game = undefined;
					return colector.stop();
				}

				msg.guild.game.playAI(difficulty)

				if (msg.guild.game.gameStatus().gameOver && msg.guild.game.gameStatus().solution) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						description: `<:zsUHHHHHH:649036589195853836> | ${client.user.tag} ha ganado la partida!`,
						channel: msg.channel,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					msg.guild.game = undefined;
					return colector.stop();
				}

				else if (msg.guild.game.gameStatus().gameOver) {
					let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game, client.imagenes);
					let att = new MessageAttachment(res, '4enraya.gif')
					sendEmbed({
						channel: msg.channel,
						description: `<:wtfDuddd:797933539454091305> | Un empate entre ${message.author.tag} y ${client.user.tag}!`,
						attachFiles: att,
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					msg.guild.game = undefined;
					return colector.stop();
				}

				let res = await displayConnectFourBoard(displayBoard(msg.guild.game.ascii()), msg.guild.game, client.imagenes);
				let att = new MessageAttachment(res, '4enraya.gif')

				await sendEmbed({
					channel: msg.channel,
					attachFiles: att,
					description: `😆 | Turno de ${message.author.tag} [\`🔴\`]`,
					imageURL: 'attachment://4enraya.gif',
					footerText: difficulty
				})
			})
			colector.on('end', async (_, r) => {

				if (r === 'SURRENDER' && message.guild.game) {
					sendEmbed({
						channel: message.channel,
						description: `<:wtfDuddd:797933539454091305> | Juego terminado...`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					return message.guild.game = undefined;
				}

				else if (r === 'idle' && message.guild.game) {
					sendEmbed({
						channel: message.channel,
						description: `<:dislike1:369553357377110027> | Duraste tres minutos sin responder, juego terminado!`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					return message.guild.game = undefined;
				}

				else if (message.guild.game && r == 'time') {
					sendEmbed({
						channel: message.channel,
						description: `<:dislike1:369553357377110027> | Ya pasaron 30 minutos, juego terminado!`,
						attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game, client.imagenes), '4enraya.gif'),
						imageURL: 'attachment://4enraya.gif',
						footerText: difficulty
					})
					await client.updateData({ id: message.author.id, difficulty }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, 'c4top');
					turnosPorId.delete(message.guild.id);
					return message.guild.game = undefined;
				}
			})
		}
	}
}
/**
 * 
 * @param {String} board 
 * @returns {Array<Array<String>>}
 */

function displayBoard(board) {
	/*
		RegEx: https://portalmybot.com/code/D519u4BFb0
	*/
	let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	let res = board
		.split('1').join('🟢')
		.split('2').join('🟡')
		.split(' - ').join('⬛')
		.split('---------------------')
		.join('')
		.split('[0]')[0]
		.split(' ').join('')
		.split('\n')
		.filter(item => item.length)
		.map(a => a.match(regex))
	return res;

}