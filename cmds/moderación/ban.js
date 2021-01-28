const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "ban"
		this.category = 'moderacion'
		this.botPermissions.guild = ['BAN_MEMBERS']
		this.memberPermissions.guild = ['BAN_MEMBERS']
	}

	/**
	* @param {Object} obj
	* @param {Discord.Client} obj.client
	* @param {Discord.Message} obj.message
	* @param {Array<String>} obj.args
	*/

	run({ message, args, embedResponse }) {

		let miembro = message.mentions.members.first();

		let razon = args.slice(1).join(' ') || 'No especificada';
		razon = razon.slice(0, 500)

		if (!miembro || miembro?.user?.bot || (miembro.user.id == message.author.id)) return embedResponse('<:cancel:779536630041280522> | Menciona a un miembro del servidor.')

		if (miembro.roles.highest.comparePositionTo(message.member.roles.highest) > 0)
			return embedResponse('<:cancel:779536630041280522> | No puedes banear a este usuario.')

		if (!miembro.bannable)
			return embedResponse('<:cancel:779536630041280522> | No puedo banear a este usuario.')

		if (!args[0].match(/<@(!)?[0-9]{18}>/g)) return embedResponse('<:cancel:779536630041280522> | La mencion tiene que ser el primer argumento.')

		if (message.author.id != message.guild.ownerID) {
			if (miembro.hasPermission('ADMINISTRATOR'))
				return embedResponse('<:cancel:779536630041280522> | ' + miembro.toString() + ' es administrador.')
		}

		let usuario = miembro.user;

		if (message.mentions.members.first().kickable) return message.mentions.members.first().ban({ reason: razon, days: 7 })
			.then(() => {
				return embedResponse('<:accept:779536642365063189> | ' + usuario.tag + ' fue baneado').catch(() => { })
			})
			.catch(() => {
				return embedResponse('<:cancel:779536630041280522> | Error en banear el miembro.').catch(() => { })
			})
	}
}