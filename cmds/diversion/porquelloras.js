/* eslint-disable no-unused-vars */
const { Message } = require('discord.js-light');
const { Client } = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "porquelloras"
        this.alias = ['pqlloras', 'whyyoucry']
        this.category = 'diversion'
    }
    /**
     * @param {Object} obj
     * @param {Message} obj.message
     * @param {Client} obj.client
     */
    async run(obj) {
        const { message, client, embedResponse, args } = obj;
        const Canvas = require("canvas");
        const Discord = require('discord.js-light');
        const canvas = Canvas.createCanvas(834, 824)
        const ctx = canvas.getContext('2d')
        const { imagenes: { porquelloras: { chico, chica } } } = client;
        const bck = message.content.toLowerCase().endsWith('-girl') ? chica : chico
        ctx.drawImage(bck, 0, 0, 834, 824)
        let atte = message.attachments.find(item => require('is-image')(item.proxyURL))?.proxyURL
        let image =
            atte || (require('is-image')(args[0] ? args[0] : 'ARGS IS UNDEFINED') ? args[0] : null)
            || client.users.cache.get(args[0])?.displayAvatarURL({ format: 'png' })
            || message.mentions.users.first()?.displayAvatarURL({ format: 'png' })
            || message.author.displayAvatarURL({ format: 'png' });

        image = await Canvas.loadImage(image)
        ctx.drawImage(image, 230, 125, 580, 475)

        const att = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png'),
            embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(client.color)
                .setFooter(message.content.endsWith('-girl') ? 'Plantilla femenina creada por: zPablo 鯉#3793' : 'Puedes usar -girl al final del mensaje para cambiar la plantilla a modo femenino.', message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .attachFiles(att)
                .setImage('attachment://image.png')

        return message.channel.send({ embed })


    }
}