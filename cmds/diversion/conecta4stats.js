const { sendEmbed } = require('../../Utils/Functions.js');
const Discord = require('discord.js-light');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "conecta4stats"
		this.alias = [`connect4stats`, 'fourinrowstats', '4enlineastats', 'c4stats']
		this.category = 'diversion'
	}
	async run({ message, args, client }) {

		let member = message.guild.members.cache.find(a => a.user.username === args.join(' ')) || message.guild.members.cache.find(a => a.user.tag === args.join(' ')) || message.guild.members.cache.find(a => a.displayName === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

		let data = await require('../../models/c4top.js').find({ id: member.user.id });

		if (!data || !data.length)
			return sendEmbed({
				channel: message.channel,
				description: `<:cancel:804368628861763664> | ${member.user} no tiene datos.`
			});

		const easy = data.find(item => item.difficulty == 'easy'),
			medium = data.find(item => item.difficulty == 'medium'),
			hard = data.find(item => item.difficulty == 'hard')

		let embed = new Discord.MessageEmbed()
			.setColor(client.color)
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 2048, dynamic: true }))
		if (easy) embed.addField('Facil', `Ganadas: ${easy.ganadas} Perdidas: ${easy.perdidas} Empates: ${easy.empates}`)
		if (medium) embed.addField('Intermedio', `Ganadas: ${medium.ganadas} Perdidas: ${medium.perdidas} Empates: ${medium.empates}`)
		if (hard) embed.addField('Dificil', `Ganadas: ${hard.ganadas} Perdidas: ${hard.perdidas} Empates: ${hard.empates}`)

		return message.channel.send({ embed: embed });
	}
}