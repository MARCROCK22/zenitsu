// eslint-disable-next-line no-unused-vars
const { MessageEmbed, Client, Presence, Util } = require('discord.js-light'),
	model = require('../../models/temp')
require('dotenv').config();
const { loadImage } = require("canvas");
/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {

	const guild = await client.guilds.fetch(`764529869739655198`);
	await guild.emojis.fetch();

	client.user.setPresence({
		status: "dnd",
		activity: {
			name: "Cargando imagenes...",
			type: "WATCHING"
		}
	});
	try {
		client.imagenes = {
			porquelloras: {
				chica: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/chica.png'),
				chico: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/chico.jpg')
			},
			nicememe: {
				background: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/nicememe.png')
			},
			tictactoe: {
				background: await loadImage(`/home/MARCROCK22/zenitsu/Utils/Images/inicio_tictactoe.gif`),
				equis: await loadImage(`/home/MARCROCK22/zenitsu/Utils/Images/x_tic.png`),
				circulo: await loadImage(`/home/MARCROCK22/zenitsu/Utils/Images/o_tic.png`)
			},
			connect4: {
				background: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/4enraya.png'),
				win: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/morado_de_4.png'),
				verde: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/rojo_de_cuatro.png'),
				amarillo: await loadImage('/home/MARCROCK22/zenitsu/Utils/Images/amarillo_de_cuatro.png')
			}
		}
	} catch { null; }
	checkTemp(client)
	presence(client)
	checkMessages()

	const { dbl } = client;
	client.color = '#E09E36';

	setInterval(async () => {
		await dbl.postStats(client.guilds.cache.size);
	}, 1800000);//30m

};

/**
@param {Client} client
@returns {Promise<Presence>}
*/

function presence(client) {
	return client.user.setPresence({
		status: "idle",
		activity: {
			name: "z!suggest | " + client.guilds.cache.size + " servidores",
			type: "WATCHING"
		}
	});
}

/**
 * 
 * @param {import('discord.js').Client} client 
 */

async function checkTemp(client) {

	const find = await model.find()

	for await (let data of find) {

		try {

			if (Date.now() >= data.toDelete) {
				await model.deleteOne(data)
				continue;
			}

			if (Date.now() >= data.tiempo) {
				if (data.type == 'mute') {
					const guild = client.guilds.cache.get(data.guild)
					if (!guild) continue;
					const role = guild.roles.cache.get(data.role)
					if (!role) continue;
					const member = guild.members.cache.get(data.id) || await guild.members.fetch(data.id).catch(() => { })
					if (!member) continue;
					await member.roles.remove(role).catch(() => { });
					await model.deleteOne(data)
				}
				else if (data.type == 'ban') {
					const guild = client.guilds.cache.get(data.guild)
					if (!guild) continue;
					await guild.members.unban(data.id).catch(() => { });
					await model.deleteOne(data)
				}
			}
			else continue;
		}
		catch (e) {
			console.error(e)
			continue;
		}
	}

	await Util.delayFor(5000)

	return await checkTemp(client)

}


async function checkMessages() {

	const find = await require('../../models/snipe').find();

	for await (let data of find) {

		if (!data.date || (data.date + require("ms")('5d') < Date.now()))
			await require('../../models/snipe').deleteOne(data);
		else continue;

	}

	await Util.delayFor(require('ms')('1m'));

	return checkMessages();

}
