const { MessageAttachment } = require('discord.js-light'),
    Canvas = require('canvas'),
    Command = require('../../Utils/Classes').Command;
const { sendEmbed } = require('../../Utils/Functions');

module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "widdleemoji"
        this.category = 'utiles'
        this.botPermissions.guild = ['ATTACH_FILES']
        this.cooldown = 10;
    }
    /**
     * 
     * @param {Object} obj
     * @param {import('discord.js').Message} obj.message
     * @param {function(String): Promise<import('discord.js').Message>} obj.embedResponse
     */
    async run(obj) {

        const { message, args, embedResponse } = obj;

        const path = require('path');
        let ruta = (zip) => path.join(__dirname, '..', '..', 'Utils', 'temp', zip)
        const fs = require('fs/promises')
        const attachment = message.attachments.find(item => require('is-image')(item?.proxyURL));

        if (!attachment)
            return sendEmbed({
                description: `<:cancel:804368628861763664> | Necesitas **adjuntar** una imagen...`,
                footerText: `Puedes especificar el numero de imagenes por columna, ${message.guild.cachePrefix}widdleemoji <num>[default=3].`,
                channel: message.channel
            })

        const width = attachment.width,
            heigth = attachment.height,
            numero = parseInt(args[0]) || 3,
            imagen = attachment?.proxyURL,
            imagenCargada = await Canvas.loadImage(imagen);

        if (numero > 20)
            return embedResponse(`<:cancel:804368628861763664> | El numero limite es **20**.`);

        if (numero <= 1)
            return embedResponse(`<:cancel:804368628861763664> | El numero minimo es **2**.`)

        if (!parseInt(width / numero) || !parseInt(heigth / numero))
            return embedResponse(`<:cancel:804368628861763664> | La imagen es muy pequeña para el numero seleccionado (${numero}).`);

        let n = 0;
        for (let x in [...new Array(numero)]) for (let y in [...new Array(numero)]) {

            const canvas = Canvas.createCanvas(width / numero, heigth / numero),
                ctx = canvas.getContext('2d');

            console.log(x * -width / numero, y * -heigth / numero);
            ctx.drawImage(imagenCargada, x * -width / numero, y * -heigth / numero, width, heigth);
            await fs.writeFile(ruta(`${message.author.id}-${n}-foto.png`), canvas.toBuffer());
            n++

        }

        let files = (await fs.readdir(path.join(__dirname, '..', '..', 'Utils', 'temp'))).filter(item => item.startsWith(message.author.id)),
            filesPng = files.filter(item => item.endsWith('.png'));

        n = 0
        const zip = new (require('node-zip'))();
        for (let i of filesPng) {
            let img = await fs.readFile(ruta(i));
            await zip.file('img-' + n + '.png', img)
            n++
        }
        const data = zip.generate({ base64: false, compression: 'DEFLATE' });
        await fs.writeFile(ruta(message.author.id + '-tempzip.zip'), data, 'binary');

        for (let file of (await fs.readdir(path.join(__dirname, '..', '..', 'Utils', 'temp'))).filter(item => item.startsWith(message.author.id) && item.endsWith('.png')))
            await fs.unlink(ruta(file))

        const rutazipfinal = ruta(`${message.author.id}-tempzip.zip`),
            zipFinal = await fs.readFile(rutazipfinal);
        await fs.unlink(rutazipfinal);

        let att = (ext) => new MessageAttachment(zipFinal, 'widdleemoji-' + message.author.id + '.' + ext)

        return message.channel.send({ files: [att('zip'), att('rar')] });
    }
}