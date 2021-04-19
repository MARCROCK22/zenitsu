const Discord = require('discord.js-light')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "vote"
        this.category = 'bot'
        this.alias = ['topgg']
    }

    run({ client, message }) {
        let embed = new Discord.MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(`<:sesonroja:804750422828515339> [TopGG](https://top.gg/bot/721080193678311554/)\n<a:gatomordedor:804368768704577548> [Votar](https://top.gg/bot/721080193678311554/vote)`)
            .setColor(client.color)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
        return message.channel.send({ embed: embed })
    }
}