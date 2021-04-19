const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "discordstatus"
        this.category = 'utiles'
        this.cooldown = 15
    }
    /**
     * 
     * @param {Object} param0
     * @param {Discord.Message} param0.message
     */
    async run({ message }) {

        let msg = await message.channel.send('<a:CatLoad:804368444526297109> | Espere un momento...');

        const url = `https://discordstatus.com`;
        const puppeteer = require('puppeteer')
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        const data = await page.content();
        await browser.close();
        const Canvas = require('canvas'),
            canvas = Canvas.createCanvas(650, 60 * 7),
            ctx = canvas.getContext('2d')
        const texts = {
            '1': 'API',
            '2': 'Media Proxy',
            '3': 'Push Notifications',
            '4': 'Search',
        };
        for (let n of [1, 2, 3, 4]) {
            let array = data.split(`<svg class="availability-time-line-graphic"`)[n].split('</svg>')[0].split('x="').map(e => e.split('"')[0]).filter(e => !isNaN(e)),
                colores = data.split(`<svg class="availability-time-line-graphic" id="uptime-component-`)[n].split('</svg>')[0].split('fill="').map(a => a.split('"')[0]).slice(1)
            ctx.fillStyle = '#ffffff'
            ctx.fillText(texts[n], 5, (n * 60) - 5)
            for (let i in array) {
                ctx.fillStyle = colores[i]
                ctx.fillRect(array[i], n * 60, 3, 34)
            }
        }

        let svg = data.split('<path fill="none" d="')[1].split('" class')[0]
        const svg2img = require('node-svg2img')
        let res = await require('util').promisify(svg2img)(`<svg><path fill="none" d="${svg}" class="highcharts-graph" data-z-index="1" stroke="#738bd7" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path></svg>`, { format: 'png', width: 900, height: 100 })
        res = await require('canvas').loadImage(res)
        ctx.drawImage(res, 0, 320, 900, 100);

        let att = new Discord.MessageAttachment(canvas.toBuffer(), 'img.png');
        let embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setTimestamp()
            .attachFiles(att)
            .setImage('attachment://img.png')
            .setAuthor('Discord Status', 'https://cdn.discordapp.com/attachments/649043690765025352/813915354010222642/750851146884710541.png', 'https://discordstatus.com/');
        return message.channel.send({ embed }).finally(() => {
            try {
                if (msg.deletable) return msg.delete();
                // eslint-disable-next-line no-empty
            } catch { }
        })
    }
}