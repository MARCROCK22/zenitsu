// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "kick"
		this.category = 'moderacion'
		this.botPermissions.guild = ['KICK_MEMBERS']
		this.memberPermissions.guild = ['KICK_MEMBERS']
	}

	/**
	* @param {Object} obj
	* @param {Discord.Client} obj.client
	* @param {Discord.Message} obj.message
	* @param {Array<String>} obj.args
	*/

	run(obj) {

		const { message, args, embedResponse } = obj;

		let miembro = message.mentions.members.first();

		let razon = args.slice(1).join(' ') || 'No especificada';
		razon = razon.slice(0, 500)

		if (!miembro) return embedResponse('<:cancel:804368628861763664> | Menciona a un miembro del servidor.')

		if ((miembro.user.id == message.author.id))
			return embedResponse('<:cancel:804368628861763664> | No te puedes expulsar a ti mismo.')

		if (miembro.roles.highest.comparePositionTo(message.member.roles.highest) >= 0)
			return embedResponse('<:cancel:804368628861763664> | No puedes expulsar a este usuario.')

		if (!miembro.kickable)
			return embedResponse('<:cancel:804368628861763664> | No puedo expulsar a este usuario.')

		if (!args[0].match(/<@(!)?[0-9]{17,18}>/g)) return embedResponse('<:cancel:804368628861763664> | La mencion tiene que ser el primer argumento.')

		let usuario = miembro.user;

		if (message.mentions.members.first().kickable) return message.mentions.members.first().kick(razon)
			.then(() => {
				return embedResponse('<:accept:804368642913206313> | ' + usuario.tag + ' fue expulsado').catch(() => { })
			})
			.catch(() => {
				return embedResponse('<:cancel:804368628861763664> | Error en expulsar el miembro.').catch(() => { })
			})
	}
}