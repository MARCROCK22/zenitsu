const Canvas = require('canvas');
const Discord = require('discord.js-light')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "elquenoconoce"
        this.category = 'diversion'
    }

    /**
     * 
     * @param {Object} obj 
     * @param {Discord.Message} obj.message
     * @param {Array<String>} obj.args
     */

    async run(obj) {

        const { message, args, embedResponse } = obj;

        const attachments = message.attachments.filter(att => require('is-image')(att?.proxyURL))

        let primero = attachments.first()?.proxyURL
            || (require('is-image')(args[0] || 'poto') ? args[0] : null)
            || message.author.displayAvatarURL({ size: 2048, format: 'png' });

        let segundo =
            attachments.array()[1]?.proxyURL || (require('is-image')(args[1] || 'poto') ? args[1] : null) || message.mentions.users.first()?.displayAvatarURL({ format: 'png', size: 2048 });

        if (!segundo)
            return embedResponse('<:cancel:804368628861763664> | Necesitas adjuntar un archivo o mencionar a alguien.')

        const avatares = [primero, segundo];

        if (args.join(' ').toLowerCase().endsWith('-reverse')) avatares.reverse();
        const canvas = Canvas.createCanvas(908, 920);
        const cxt = canvas.getContext('2d');

        cxt.fillStyle = '#ffffff';
        cxt.fillRect(0, 0, 908, 920);

        cxt.fillStyle = '#000000';
        cxt.font = '50px arial';
        cxt.alignText = 'center';
        cxt.fillText('El que no conoce a Dios', 160, 100);

        cxt.strokeStyle = '#000000';
        cxt.lineWidth = 3;
        cxt.strokeRect(120, 150, 650, 320);

        const firstAvatar = await Canvas.loadImage(avatares[0]);
        cxt.drawImage(firstAvatar, 120, 150, 650, 320);

        cxt.fillStyle = '#000000';
        cxt.font = '50px arial';
        cxt.alignText = 'center';
        cxt.fillText('A cualquier santo le reza', 160, 520);

        cxt.strokeStyle = '#000000';
        cxt.lineWidth = 3;
        cxt.strokeRect(120, 550, 650, 320);

        const lastAvatar = await Canvas.loadImage(avatares[1]);
        cxt.drawImage(lastAvatar, 120, 550, 650, 320);

        const image = new Discord.MessageAttachment(canvas.toBuffer(), 'meme.png');

        let embed = new Discord.MessageEmbed()
            .attachFiles(image)
            .setImage('attachment://meme.png')
            .setTimestamp()
            .setColor(message.client.color)
            .setFooter('Puedes usar -reverse para cambiar de posición las imagenes.')

        return message.channel.send({ embed });
    }
}