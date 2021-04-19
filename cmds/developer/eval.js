const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "eval"
		this.alias = ['e']
		this.category = 'developer'
		this.dev = true;
	}
	async run(obj) {

		const Discord = require('discord.js-light')
		const { replace } = require('../../Utils/Functions.js');
		// eslint-disable-next-line no-unused-vars
		const { client, message, args, embedResponse, Hora } = obj;
		if (!client.devseval.includes(message.author.id))
			return;
		try {
			let code = args.join(" ");
			let evalued = await eval(code);
			let TYPE = typeof (evalued)
			evalued = require("util").inspect(evalued, { depth: 0 });
			evalued = replace(evalued, [process.env.PASSWORD, client.token, process.env.PASSWORDDBL, process.env.MONGODB, process.env.WEBHOOKID, process.env.WEBHOOKTOKEN, process.env.DBLTOKEN, require('mongoose').connection.pass, require('mongoose').connection.user, require('mongoose').connection.host])
			const res = Discord.Util.splitMessage(evalued, { char: '', maxLength: 2000 });

			for (let minires of res) {
				const embed = new Discord.MessageEmbed()
					.setColor(client.color)
					.setDescription('```js\n' + minires + '\n```')
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
					.addField('typeof', '```js\n' + TYPE + '\n```', true)
				message.channel.send({ embed: embed })
				await Discord.Util.delayFor(2000)
			}
		} catch (err) {
			message.channel.send(err, { code: 'js' })
		}
	}
}