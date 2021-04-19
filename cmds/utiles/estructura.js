const Discord = require('discord.js-light')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "estructura"
		this.category = 'utiles'
	}
	async run({ message, args }) {

		let todo = '';
		let memberXD = message.guild.members.cache.find(a => a.displayName == args.join(' ') || a.user.tag == args.join(' ') || a.user.username == args.join(' ')) || message.mentions.members.first()
			|| message.guild.members.cache.get(args[0])
			|| message.mentions.roles.first()
			|| message.guild.roles.cache.get(args[0])
			|| message.guild.roles.cache.find(r => r.name === args.join(' '))
		message.member;
		if (!memberXD) memberXD = message.member
		let printT = message.guild.channels.cache.filter(a => a.type == 'category').sort((a, b) => a.position - b.position);

		let without = message.guild.channels.cache.filter(a => !a.parent && a.type != 'category')

		let textos = without.sort((a, b) => a.position - b.position).filter(a => a.type != 'voice').filter(a => a.permissionsFor(memberXD).has('VIEW_CHANNEL'))
		let voz = without.sort((a, b) => a.position - b.position).filter(a => a.type == 'voice').filter(a => a.permissionsFor(memberXD).has('VIEW_CHANNEL'))
		textos = textos.map(a => `\t${name(a)}`)
		voz = voz.map(a => `${textos.length >= 1 ? '\n' : ''}\t[🔊] ${a.name}${membersInfoInChannel(a)}`)

		todo += `${textos.join('\n')}`
		todo += `${voz.join('\n')}`;

		printT = printT.map(cat => {

			let canales_no_voice = cat.children.filter(a => a.permissionsFor(memberXD).has('VIEW_CHANNEL')).filter(a => a.type != 'voice')
			let canales_si_voice = cat.children.filter(a => a.permissionsFor(memberXD).has('VIEW_CHANNEL')).filter(a => a.type == 'voice')
			if (canales_no_voice.size == 0 && canales_si_voice.size == 0)
				return undefined;
			return `[📁] ${cat.name} ${canales_no_voice.sort((a, b) => a.position - b.position).map(a => `\n\t${name(a)}`).join('')}${canales_si_voice.sort((a, b) => a.position - b.position).map(a => `\n\t[🔊] ${a.name}${membersInfoInChannel(a)}`).join('')}\n`

		}).filter(a => a)

		todo += `\n${printT.join('')}`

		let res = Discord.Util.splitMessage(`**Estructura de ${memberXD?.user?.tag || memberXD.name}** [${(memberXD instanceof Discord.GuildMember) ? 'miembro' : 'rol'}]\n\n` + todo, { maxLength: 1900 });

		for (let a of res) {
			let embed = new Discord.MessageEmbed()
				.setTimestamp()
				.setColor(message.client.color)
				.setDescription('```' + a + '```')

			await message.channel.send({ embed }).catch(() => { })
		}

		function membersInfoInChannel(channel) {

			let str = '';

			let streaming = sortMembers(channel.members.filter(a => a.voice.streaming));
			streaming = streaming.map(member => member.user.bot ? `\n\t\t[${emojisVoice(member, '🎧🤖', '🤖')}] ${member.displayName} [EN DIRECTO]` : `\n\t\t[${emojisVoice(member, '🎧🙎', '🙎')}] ${member.displayName} [EN DIRECTO]`)
			streaming.forEach(a => {

				str += a

			});

			let noStreaming = sortMembers(channel.members.filter(a => !a.voice.streaming));
			noStreaming = noStreaming.map(member => member.user.bot ? `\n\t\t[${emojisVoice(member, "🎧🤖", '🤖')}] ${member.displayName}` : `\n\t\t[${emojisVoice(member, '🎧🙎', '🙎')}] ${member.displayName}`)
			noStreaming.forEach(a => {

				str += a

			});
			return str;
		}
	}
}

/**
 * 
 * @param {import('discord.js').TextChannel} a
 * @returns {String}
 */
function name(a) {

	return a.guild.systemChannelID == a.id ? `[📥] ${a.name}` : a.guild.rulesChannelID == a.id ? `[📕] ${a.name}` : a.nsfw ? `[🔞] ${a.name}` : a.type == 'text' ? `[💬] ${a.name}` : a.type == 'news' ? `[🔔] ${a.name}` : a.type == 'store' ? `[🏬] ${a.name}` : `[❓] ${a.name}`;

}

function emojisVoice(member, deaf, normal) {

	return `${member.voice.selfMute || member.voice.serverMute ? '🔇' : ''}${member.voice.selfVideo ? '🎥' : ''}${member.voice.selfDeaf || member.voice.serverDeaf ? deaf : normal}`

}

function sortMembers(members) {

	let items = members.array()

	return items.sort(function (a, b) {
		if (a.displayName > b.displayName) {
			return 1;
		}
		if (a.displayName < b.displayName) {
			return -1;
		}
		return 0;
	});
}