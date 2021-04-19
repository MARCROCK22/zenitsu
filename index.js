require('moment').locale('es')
const Discord = require('discord.js-light'),
	{ Collection } = require('discord.js-light');
const mongoose = require('mongoose');
require('dotenv').config();

Discord.Structures.extend('Guild', g => {

	class Guild extends g {

		constructor(client, data) {
			super(client, data);
		}

		async getPrefix() {

			let res = await client.getData({ id: this.id }, 'prefix').catch(() => { }) || { prefix: 'z!' };
			return res.prefix;

		}

	}
	return Guild;
});

Discord.Structures.extend('User', g => {

	class User extends g {

		constructor(client, data) {
			super(client, data);
		}

		async fetchAfk() {
			let func = async () => {
				// eslint-disable-next-line no-prototype-builtins
				if (this.hasOwnProperty('cacheIsAfk'))
					return this.cacheAfk
				else return await require('./models/afk').findOne({ id: this.id })

			}
			this.cacheAfk = await func() || {}
			return this.cacheAfk
		}

		async deleteAfk() {
			await this.setAfk(this.cacheAfk.reason, this.cacheAfk.date, false)
			return true;
		}

		/**
		 * 
		 * @param {String} reason 
		 */

		async setAfk(reason = 'AFK', date = Date.now(), status = true) {
			let info = await client.updateData({ id: this.id }, { reason, date, status }, 'afk');
			this.cacheAfk = info
			return this.cacheAfk
		}

	}
	return User;
});

const client = new Discord.Client(
	{
		partials: ['PRESENCE', 'MESSAGE', 'REACTION'],
		http: { version: 7 },
		messageCacheMaxSize: 100,
		messageSweepInterval: 3600,
		messageCacheLifetime: 1800,
		messageEditHistoryMaxSize: 1,
		allowedMentions: { parse: [] },
		ws: {
			intents: 1701
		},
		cacheGuilds: true,
		cacheOverwrites: true,
		cacheRoles: true,
		cacheEmojis: false,
		cachePresences: false,
		cacheChannels: true,
		disabledEvents: [
			'RESUMED',
			'INVITE_CREATE',
			'INVITE_DELETE',
			'GUILD_MEMBER_ADD',
			'GUILD_MEMBER_REMOVE',
			'GUILD_MEMBER_UPDATE',
			'GUILD_MEMBERS_CHUNK',
			'GUILD_INTEGRATIONS_UPDATE',
			'GUILD_BAN_ADD',
			'GUILD_BAN_REMOVE',
			'GUILD_EMOJIS_UPDATE',
			'CHANNEL_PINS_UPDATE',
			'MESSAGE_UPDATE',
			'MESSAGE_DELETE_BULK',
			'MESSAGE_REACTION_REMOVE',
			'MESSAGE_REACTION_REMOVE_ALL',
			'MESSAGE_REACTION_REMOVE_EMOJI',
			'USER_UPDATE',
			'PRESENCE_UPDATE',
			'TYPING_START',
			'WEBHOOKS_UPDATE',
		]
	}
);

const DBL = require("dblapi.js");
client.dbl = new DBL(process.env.DBLTOKEN, client);

client.newDate = (ms) => {

	let res = new Date(ms).toISOString().slice(11, 19);

	while (res.startsWith('00:')) {
		res = res = res.slice(3)
	}
	return res;

}
client.kaomojis = ['(* ^ ω ^)', '(o^▽^o)', 'ヽ(・∀・)ﾉ', '(o･ω･o)', '( ´ ω ` )', '╰(▔∀▔)╯', '(✯◡✯)', '(⌒‿⌒)', 'ヽ(>∀<☆)ノ', '＼(￣▽￣)／', '(╯✧▽✧)╯', '(⁀ᗢ⁀)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'ヽ(*⌒▽⌒*)ﾉ', '☆*:.｡.o(≧▽≦)o.｡.:*☆', '(๑˃ᴗ˂)ﻭ', '(b ᵔ▽ᵔ)b', '(⌒ω⌒)', '(´ ∀ ` *)', '(─‿‿─)'];
client.devseval = [
	'507367752391196682', // Lil MARCROCK22
	'577000793094488085', // AndreMor
	'366779196975874049', // Socram09
	'390726024536653865' // zPablo 鯉
];
// eslint-disable-next-line no-unused-vars
const Classes = require('./Utils/Classes.js');
/**
 * 
 * @param {Classes.embedOptions} object 
 * @param {Object} options
 * @param {Number} options.timestamp
 * @returns {Promise<Discord.Message>} 
 */
client.sendEmbed = (object = {}, options = { timestamp: Date.now() }) => {

	let embed = new Discord.MessageEmbed()

	let { fields, description, imageURL, footerLink, footerText, color, channel, title, thumbnailURL, authorURL, authorText, authorLink } = object;

	fields && fields.length ? fields.map(a => embed.addField(a[0], a[1], a[2] ? true : false)) : false
	if (description) embed.setDescription(description)
	if (imageURL) embed.setImage(imageURL);
	if (thumbnailURL) embed.setThumbnail(thumbnailURL)
	if (footerLink && footerText) embed.setFooter(footerText, footerLink)
	else {
		if (footerText) embed.setFooter(footerText)
		if (footerLink) embed.setFooter('\u200b', footerLink)
	}
	if (authorText && authorLink && authorURL) embed.setAuthor(authorText, authorLink, authorURL)
	else if (authorText && authorLink) embed.setAuthor(authorText, authorLink)
	if (color) embed.setColor(color)
	if (title) embed.setTitle(title)
	if (options.timestamp) embed.setTimestamp()
	if (!channel || !channel.send) throw new Error('No es un canal valido.');
	return channel.send({ embed: embed });

}

/*const moment = require('moment');
moment.updateLocale('es', {
	months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
	monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
	weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
	weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
	weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
}
);
moment.locale("es");*/

client.queue = new Map();

require('dotenv').config();

["alias", "commands"].forEach(x => client[x] = new Collection());
["comandos", "eventos"].forEach(x => require(`./handler/${x}`)(client));

mongoose.set('useFindAndModify', false)

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log("[MongoDB]: Conectado a la base de datos Mongodb.");
}).catch((err) => {
	console.log(`[Error]: No se puede conectar a la base de datos de Mongodb. Error: ${err}`);
});

client.login(process.env.BOT_TOKEN)
	.then(() => {

		console.log(`Estoy listo, soy ${client.user.tag}`);

	})
	.catch((err) => {

		console.error("Error al iniciar sesión: " + err);

	});

client.getData = async ({ ...find }, model, createifnoexists = true) => {

	const { readdir } = require("fs").promises;
	const db_files = await readdir(require("path").join(__dirname, "./models/"));
	const available_models = db_files.map(elem => elem.endsWith("js") ? elem.slice(0, -3) : elem);

	if (!available_models.includes(model)) throw new Error('[GET_DATA]: Model no encontrado!')

	let db = require('./models/' + model + '.js');

	let getModel = (await db.findOne(find));

	if (!getModel && createifnoexists) {

		return await db.create(find) || {};

	}

	else return getModel || {};

}

client.updateData = async ({ ...find }, { ...newValue }, model) => {

	const { readdir } = require("fs").promises;
	const db_files = await readdir(require("path").join(__dirname, "./models/"));
	const available_models = db_files.map(elem => elem.endsWith("js") ? elem.slice(0, -3) : elem);

	if (!available_models.includes(model)) throw new Error('[UPDATE_DATA]: Model no encontrado!')

	let db = require('./models/' + model + '.js');

	let update = await db.findOneAndUpdate(find, newValue, { new: true });

	if (!update) {

		await db.create(find)

		return await db.findOneAndUpdate(find, newValue, { new: true });

	}

	else {

		return update;

	}

};

/*
(async () => {

const { readdir } = require("fs").promises;
const db_files = await readdir(require("path").join(__dirname, "./models/"));
const available_models = db_files.map(elem => elem.endsWith("js") ? elem.slice(0, -3) : elem);

client.getData = async ({ ...search }, db, inexistentSave = true) => {
	if (!search || !db) return;
	if (!available_models.includes(db))
		return console.log("[-] (getData) Se esperaba una colección existente, pusiste esta: " + db);

	const db_collection = require(`./models/${db}`);
	const data = await db_collection.findOne(search);
	if (!data && inexistentSave) await client.createData(search, db);

	return data || {};
}

client.createData = async (data, db) => {
	if (!data || !db) return;
	if (!available_models.includes(db))
		return console.log("[-] (createData) Se esperaba una colección existente, pusiste esta: " + db);

	const db_collection = require(`./models/${db}`);
	let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, data);

	const newData = new db_collection(merged);
	return newData.save().catch(err => console.log(err));
}

client.updateData = async ({ ...search }, { ...settings }, db, saveIfNotExists = true) => {
	if (!search || !settings || !db) return;
	if (!available_models.includes(db))
		return console.log("[-] (updateData) Se esperaba una colección existente, pusiste esta: " + db);

	let data = await client.getData(search, db);
	if (typeof data !== "object") data = {};
	if (!Object.keys(data).length) {
		if (saveIfNotExists)
			return setTimeout(async () => { await client.updateData(search, settings, db) }, 1000);
		else
			return null; //console.log("[-] (updateData) Si quieres actualizar datos aún así no exista el documento, pon como 4to parámetro en la función: true.");
	}

for (const key in settings) {
if (settings.hasOwnProperty(key)) {
	if (data[key] !== settings[key]) data[key] = settings[key];
}
}
return await data.updateOne(settings);
}
}) ();
*/
client.remplazar = (texto) => {

	return texto.split('*').join(`\\*`).split('`').join("\\`").split('~').join(`\\~`).split('_').join(`\\_`).split('|').join(`\\|`);

};

client.duration = (ms) => {
	return duration(ms);
}

function duration(segundos) {
	let s = parseInt(segundos) * 1000
	let ms = s % 1000;
	s = (s - ms) / 1000;
	let secs = s % 60;
	s = (s - secs) / 60;
	let mins = s % 60;
	let hrs = (s - mins) / 60;
	if (`${secs}`.length === 1) {
		secs = `0${secs}`;
	}

	if (`${mins}`.length === 1) {
		mins = `0${mins}`;
	}

	if (hrs <= 0) {
		if (mins <= 0) {
			return 0 + ':' + secs;
		} else {
			return mins + ":" + secs;
		}
	} else {
		return hrs + ":" + mins + ":" + secs;
	}
}

client.rModel = (n) => {

	return require(`./models/${n}.js`)

}

process.on("unhandledRejection", e => {
	console.log(e)
	new Discord.WebhookClient(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN).send(
		new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('Error')
			.setDescription(`Promesa denegada sin manejar: ${e.stack}`.slice(0, 2000))
			.setTimestamp()
	).catch(() => { })
});
