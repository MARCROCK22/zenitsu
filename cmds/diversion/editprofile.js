/* eslint-disable no-case-declarations */
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi
const Command = require('../../Utils/Classes').Command;
const { default: image } = require('image-url-validator');
const Discord = require('discord.js-light');
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "editprofile"
		this.category = 'diversion'
	}

	/**
	 * 
	 * @param {Object} obj
	 * @param {import('discord.js').Message} obj.message
	 * @param {import('discord.js').Client} obj.client
	 * @param {Array<String>} obj.args
	 * @returns {Promise<(import('discord.js').Message|void)>}
	 */

	async run(obj) {

		const { client, message, args, embedResponse } = obj
		let data;
		let valor = args.slice(1).join(' ');
		switch (args[0]) {
			case 'description':

				if (!valor) return embedResponse('<:cancel:804368628861763664> | Necesitas especificar tu descripción.')

				if (valor.length >= 1024) return embedResponse('<:cancel:804368628861763664> | Limite de caracteres sobrepasados. (1024)')

				data = await client.updateData({ id: message.author.id }, { description: valor }, 'profile')

				return embedResponse(`Descripción cambiada correctamente.`);

			case 'img':
				const url = ((message.attachments.array()[0] && await image(message.attachments.array()[0].proxyURL))
					? message.attachments.array()[0].proxyURL
					: null) || ((args[1]?.match(regex) && await image(args[1]?.match(regex)[0]))
						? args[1]?.match(regex)[0]
						: null)

				if (!url)
					return embedResponse('<:cancel:804368628861763664> | Adjunta un archivo o introduce una URL valida.');

				data = await client.updateData({ id: message.author.id }, { img: url }, 'profile')

				let embed = new Discord.MessageEmbed()
					.setColor(client.color)
					.setTimestamp()
					.setImage(url)
					.setDescription('Imagen cambiada.')

				return message.channel.send({ embed })

			case 'thumbnail':
				const url1 = ((message.attachments.array()[0] && await image(message.attachments.array()[0].proxyURL))
					? message.attachments.array()[0].proxyURL
					: null) || ((args[1]?.match(regex) && await image(args[1]?.match(regex)[0]))
						? args[1]?.match(regex)[0]
						: null)

				if (!url1)
					return embedResponse('<:cancel:804368628861763664> | Adjunta un archivo o introduce una URL valida.');

				data = await client.updateData({ id: message.author.id }, { thumbnail: url1 }, 'profile')

				let embed1 = new Discord.MessageEmbed()
					.setColor(client.color)
					.setTimestamp()
					.setThumbnail(url1)
					.setDescription('Thumbnail cambiado.')

				return message.channel.send({ embed: embed1 })
			case 'footerimg':

				const url2 = ((message.attachments.array()[0] && await image(message.attachments.array()[0].proxyURL))
					? message.attachments.array()[0].proxyURL
					: null) || ((args[1]?.match(regex) && await image(args[1]?.match(regex)[0]))
						? args[1]?.match(regex)[0]
						: null)

				if (!url2)
					return embedResponse('<:cancel:804368628861763664> | Adjunta un archivo o introduce una URL valida.');

				data = await client.updateData({ id: message.author.id }, { footer: url2 }, 'profile')

				let embed2 = new Discord.MessageEmbed()
					.setColor(client.color)
					.setTimestamp()
					.setFooter('\u200b', url2)
					.setDescription('Imagen del pie de pagina cambiada.')

				return message.channel.send({ embed: embed2 })

			case 'footertext':
				if (!valor) return embedResponse('<:cancel:804368628861763664> | Necesitas especificar el texto para introducir.')

				if (valor.length >= 1024) return embedResponse('<:cancel:804368628861763664> | Limite de caracteres sobrepasados. (1024)')

				data = await client.updateData({ id: message.author.id }, { footertext: valor }, 'profile')

				return embedResponse('Texto del footer cambiado.');



			case 'nick':

				if (!valor) return embedResponse('<:cancel:804368628861763664> | Necesitas especificar el apodo.')

				if (valor.length >= 1024) return embedResponse('<:cancel:804368628861763664> | Limite de caracteres sobrepasados. (1024)')

				data = await client.updateData({ id: message.author.id }, { nick: valor }, 'profile')

				return embedResponse('Apodo cambiado.');

			case 'color':
				// eslint-disable-next-line no-case-declarations
				const check = /^#[a-fA-F0-9]{3,6}$/.test(args[1])

				if (!check) return embedResponse('<:cancel:804368628861763664> | Necesitas introducir un color valido. (hex color)')

				data = await client.updateData({ id: message.author.id }, { color: `${args[1]}` }, 'profile')

				let embed3 = new Discord.MessageEmbed()
					.setColor(data.color)
					.setTimestamp()
					.setDescription('Color cambiado.\n\n<-- Fue cambiado a este. (' + data.color + ')')

				return message.channel.send({ embed: embed3 })

			default:
				embedResponse(
					"Elige entre las opciones:\n" +
					"color <hex color>\n" +
					"nick <apodo>\n" +
					"footertext <nuevo pie de pagina>\n" +
					"footerimg <nueva imagen en el pie de pagina>(puedes adjuntar una imagen)\n" +
					"thumbnail <nuevo thumbnail>(puedes adjuntar una imagen)\n" +
					"img <nueva imagen>(puedes adjuntar una imagen)\n" +
					"description <nueva descripcion>"
				)
				break;
		}
	}
}