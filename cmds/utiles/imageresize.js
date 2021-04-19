// eslint-disable-next-line no-unused-vars
const { Message, MessageAttachment, MessageEmbed, Util, TextChannel } = require('discord.js-light')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "imageresize"
        this.alias = ['imgresize']
        this.category = 'utiles'
        this.cooldown = 20;
    }

    /**
     * 
     * @param {Object} param0
     * @param {Message} param0.message
     * @param {Array<String>} param0.args
     * @param {function(String): Promise<Message>} param0.embedResponse
     */


    async run({ message, args, client, embedResponse }) {

        let att = message.attachments.first();

        let validate = require('image-url-validator').default,
            at = await validate(att?.proxyURL || 'askdakd'),
            argsito = await validate(args[2] || 'adkao')

        if (!(at) && !(argsito))
            return embedResponse('<:cancel:804368628861763664> | Necesitas adjuntar un archivo.');

        const url = (at ? att.proxyURL : argsito ? args[2] : null)

        const numerito = parseInt(args[0]),
            segundonumerito = parseInt(args[1])

        if (!isNaN(numerito) && !isNaN(segundonumerito)) {

            if (numerito > 1000 || segundonumerito > 1000)
                return embedResponse(`<:cancel:804368628861763664> | El tamaño máximo es 1000x1000.`);

            if (isNegative(numerito) || isNegative(segundonumerito))
                return embedResponse(`<:cancel:804368628861763664> | El tamaño máximo es 1000x1000, pero positivos <:_XD:599689626835484672>.`);

            let attachment = await resizeImage(url, numerito, segundonumerito, message.channel)

            let embed = new MessageEmbed()
                .setImage(attachment)
                .setColor(client.color)
                .setTimestamp()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }), attachment)
                .setFooter(`La imagen solo durara un minuto, si quieres puedes descargartela...`)

            return message.channel.send({ content: `${message.member}`, embed });

        }

        else {

            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor(client.color)
                .setDescription()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Para poder modificar una imagen/gif necesitas espeficicar la altura y el ancho.`)
                .addField('Ejemplo', `${message.guild.cachePrefix}imgresize 50 150 [url/attachment]`)

            return message.channel.send({ embed });

        }

    }
}
/**
 * 
 * @param {Number} num
 * @returns {Boolean}
 */
function isNegative(num) {
    if (isNaN(num)) throw new Error('Invalid number.');
    return num < 0;
}
/**
 * 
 * @param {String} link 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Boolean} isGif
 * @param {TextChannel} channel
 * @returns {Promise<String>}
 */

async function resizeImage(link = 'https://', width = 50, height = 50, channel) {

    const sharp = require('sharp');

    /**@type {Buffer} */
    const buffer = await require('node-fetch')(link).then(esto => esto.buffer())

    if (require('is-gif')(buffer)) {

        let msg = await channel.send('<:wearymonke:816652946418827284> | Espere un momento...').catch(() => { });

        const { resizeGif } = require('../../Utils/Functions');

        const res = await resizeGif({ width, height, stretch: true })(buffer)

        const FormData = require('form-data'),
            formData1 = new FormData()

        formData1.append('file', res, { contentType: 'image/gif', name: 'file', filename: 'file.gif' });

        const fetch = require('node-fetch'),
            res1 = await fetch(`https://zenitsu.eastus.cloudapp.azure.com/images`, {
                method: 'POST',
                body: formData1,
                headers: {
                    authorization: process.env.PASSWORD
                },
            }),
            { link } = await res1.json();

        if (!msg.deleted && msg.deletable) msg.delete({ timeout: 3000 }).catch(() => { })

        return link;

    } else {
        const bufferSharp = await sharp(buffer)
            .resize({
                width,
                height,
                fit: `fill`,
            })
            .toBuffer(),
            FormData = require('form-data'),
            formData2 = new FormData()
        formData2.append('file', bufferSharp, { contentType: 'image/png', name: 'file', filename: 'file.png' })
        const fetch = require('node-fetch'),
            res2 = await fetch(`https://zenitsu.eastus.cloudapp.azure.com/images`, {
                method: 'POST',
                body: formData2,
                headers: {
                    authorization: process.env.PASSWORD
                },
            }),
            { link } = await res2.json();
        return link;
    }
}