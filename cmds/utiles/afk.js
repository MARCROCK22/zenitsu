
const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "afk"
        this.category = 'utiles'
    }
    async run({ client, message, args }) {

        if (args.join(' ').length >= 250)
            return message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setColor(client.color)
                    .setDescription('<:cancel:804368628861763664> | La razón debe tener menos de 250 caracteres.')
                    .setTimestamp()
            })

        await message.author.setAfk(args.join(' ') ? args.join(' ') : 'AFK')

        return message.channel.send({
            embed: new Discord.MessageEmbed()
                .setColor(client.color)
                .setAuthor(`🛌 | Ahora te encuentras afk.`)
                .setDescription(message.author.cacheAfk.reason)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
        }).catch(() => { });
    }
};