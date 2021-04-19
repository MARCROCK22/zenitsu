const Canvas = require('canvas')
/* eslint-disable no-unused-vars */
const { Message, MessageAttachment } = require('discord.js-light');
const { Client } = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
	constructor() {
		super()
		this.name = "nicememe"
		this.alias = []
		this.category = 'diversion'
	}
	/**
	 * @param {Object} obj
	 * @param {Message} obj.message
	 * @param {Client} obj.client
	 */
	async run(obj) {
		const { message, client, embedResponse, args } = obj;

		let atte = message.attachments.find(item => require('is-image')(item.proxyURL))?.proxyURL
		let foto =
			atte || (require('is-image')(args[0] ? args[0] : 'ARGS IS UNDEFINED') ? args[0] : null)
			|| client.users.cache.get(args[0])?.displayAvatarURL({ format: 'png' })
			|| message.mentions.users.first()?.displayAvatarURL({ format: 'png' })
			|| message.author.displayAvatarURL({ format: 'png' });

		foto = await Canvas.loadImage(foto)
		const canvas = Canvas.createCanvas(552, 513);
		let bck = client.imagenes.nicememe.background
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bck, 0, 0, 552, 513)
		ctx.drawImage(foto, 15, 10, 525, 350)
		return enviar(message, canvas.toBuffer(), 'img.png')

	}
}

/**
 * @namespace enviar
 * @param {import('discord.js').Message} message 
 * @param {Buffer} buffer
 * @param {String} name
 * @returns {Promise<import('discord.js').Message>}
 * @example 
 * enviar(message, canvas.toBuffer(), 'img.png')
 */

function enviar(message, buffer, name) {

	const att = new MessageAttachment(buffer, name)
	return message.channel.send({ files: [att] })

}