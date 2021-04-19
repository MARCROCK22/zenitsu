const { buffer: toBuffer } = require('../../Utils/Functions')
const Command = require('../../Utils/Classes').Command;
const { loadImage, createCanvas } = require('canvas');
const gifencoder = require('gifencoder')
// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js-light')
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "funkin"
        this.alias = ['fnf']
        this.category = 'developer'
        this.dev = true;
        this.cooldown = 60;
    }
    // eslint-disable-next-line no-unused-vars
    /**
     * @param {Object} param0
     * @param {Message} param0.message
     */
    async run({ message, args, client }) {


        const imagenes = client.fnf || {
            u: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274416402726992/unknown3.png`),
            uf: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274466412593162/unknown5.png`),
            d: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274471415742494/unknown1.png`),
            df: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274470895648808/unknown4.png`),
            r: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274474338779196/unknown2.png`),
            rf: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274474330390578/unknown6.png`),
            l: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274473747251250/unknown.png`),
            lf: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819274472540078080/unknown7.png`),
            n: await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819284054750789632/unknown8.png`),
        },
            avaliables = Object.keys(imagenes),
            background = await loadImage(`https://cdn.discordapp.com/attachments/814190707296305162/819290447737782282/img.png`);

        client.fnf = imagenes;

        const moves = args.filter(item => avaliables.includes(item));
        const encoder = new gifencoder(1235, 675);
        encoder.start();
        encoder.setDelay(150);
        encoder.setQuality(10);
        const canvas = createCanvas(1235, 675);
        let msg = await message.channel.send('Cargando...').catch(() => { });
        let num = 0,
            total = 0
        const ctx = canvas.getContext('2d');
        for (let i of moves) {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(imagenes[i], 700, 300, 300, 350)
            encoder.addFrame(ctx);
            await require('discord.js-light').Util.delayFor(2000)
            if (num >= 5) {
                if (msg && !msg.deleted) {
                    try {
                        msg = await msg.edit(`${total} frames de ${moves.length}...`).catch(() => { })
                    } catch {
                        null;
                    }
                }
                num = 0;
            }
            num++
            total++
        }
        const stream = encoder.createReadStream();
        encoder.finish();

        let buffer = await require('util').promisify(toBuffer)(stream);

        const FormData = require('form-data'),
            formData1 = new FormData()

        formData1.append('file', buffer, { contentType: 'image/gif', name: 'file', filename: 'file.gif' });


        const fetch = require('node-fetch'),
            res1 = await fetch(`https://zenitsu.eastus.cloudapp.azure.com/images`, {
                method: 'POST',
                body: formData1,
                headers: {
                    authorization: process.env.PASSWORD
                },
            }),
            { link } = await res1.json();

        message.channel.send(link);

    }
};