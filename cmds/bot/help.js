const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()

		this.name = "help"
		this.alias = ['h']
		this.category = 'bot'

	}
	run({ client, message }) {

		let embedHelp = new Discord.MessageEmbed()
			.setColor(client.color)
			.setTimestamp()
			.addField('Utiles', client.commands.filter(a => a.category === 'utiles').map(a => `\`${a.name}\``).join(', '))
			.addField('Diversion', client.commands.filter(a => a.category === 'diversion').map(a => `\`${a.name}\``).join(', '))
			.addField('Moderación', client.commands.filter(a => a.category === 'moderacion').map(a => `\`${a.name}\``).join(', '))
			.addField('Bot', client.commands.filter(a => a.category === 'bot').map(a => `\`${a.name}\``).join(', '))
			.addField('Administracion', client.commands.filter(a => a.category === 'administracion').map(a => `\`${a.name}\``).join(', '))
			.addField('Economia', client.commands.filter(a => a.category === 'economy').map(a => `\`${a.name}\``).join(', '))
			.addField('Extra', client.commands.filter(a => a.category === 'extra').map(a => `\`${a.name}\``).join(', '))
			.addField('(Solo disponible en el soporte)', client.commands.filter(a => a.category === 'servidor').map(a => `\`${a.name}\``).join(', '))
			.setImage('https://cdn.discordapp.com/attachments/765608178540609598/766651849050292234/para_el_pibe_2.jpg')

		return message.channel.send({ embed: embedHelp });
	}
}