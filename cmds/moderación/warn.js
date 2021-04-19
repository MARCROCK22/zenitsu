const Discord = require('discord.js-light');
const easy = require('easymaty');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "warn"
		this.category = 'moderacion'
		this.botPermissions.guild = ['KICK_MEMBERS']
		this.memberPermissions.guild = ['KICK_MEMBERS']
	}
	async run({ client, message, args, embedResponse, Hora }) {

		let miembro = message.mentions.members.first();

		let razon = args.slice(1).join(' ') || 'No especificada';

		if (!miembro) return embedResponse('<:cancel:804368628861763664> | Menciona a un miembro del servidor.')

		if (message.author.id == miembro.user.id) return embedResponse(`<:cancel:804368628861763664> | No te puedes advertir a ti mismo.`)

		if (miembro.roles.highest.comparePositionTo(message.member.roles.highest) >= 0)
			return embedResponse('<:cancel:804368628861763664> | No puedes advertir a este usuario.')

		if (!miembro.kickable)
			return embedResponse('<:cancel:804368628861763664> | No puedo advertir a este usuario.')

		if (!args[0].match(/<@(!)?[0-9]{17,18}>/g)) return embedResponse('<:cancel:804368628861763664> | La mencion tiene que ser el primer argumento.')

		miembro = miembro.user;

		let chec = async (e) => { if (await require('../../models/warns.js').findOne({ idMember: miembro.id, token: e })) return await chec(easy.clave(6, '123456789')); else return e; }

		let res = await chec(easy.clave(6, '123456789'));

		let data = (await client.updateData({ idGuild: message.guild.id, idMember: miembro.id }, { $push: { warns: { razon: razon, fecha: Hora(Date.now(), true), mod: message.author.tag, token: res } } }, 'warns'));

		let check = 5

		if (data.warns.length >= check)

			if (message.mentions.members.first().kickable) return message.mentions.members.first().kick(razon)
				.then(async () => {
					embedResponse('<:accept:804368642913206313> | ' + miembro.tag + ' fue expulsado').catch(() => { })
					return await require('../../models/warns.js').deleteOne({ idGuild: message.guild.id, idMember: miembro.id });
				})

				.catch(() => {
					embedResponse('<:cancel:804368628861763664> | Error en expulsar el miembro.').catch(() => { })
				})

		let embed = new Discord.MessageEmbed()
			.setColor(client.color)
			.setTimestamp()
			.setTitle('Miembro advertido')
			.setAuthor(miembro.tag, miembro.displayAvatarURL({ dynamic: true }))
			.addField('<:reason2:804368699887845376> Razón', razon.slice(0, 1024), true)
			.addField('<:moderator:804368587115593800> Moderador', message.author.tag, true)
			.addField('\u200b', '\u200b', true)
			.addField('📄 Advertencias totales', data.warns.length, true)
			.addField('<:reason:779536605047554068> Advertencias para ser expulsado', check, true)
			.setFooter(`🆔 ID: ${res} - Fecha: ${Hora(Date.now(), true)}`)

		return message.channel.send({ embed: embed }).catch(() => { });
	}
}