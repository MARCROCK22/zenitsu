const { MessageEmbed } = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "reportbug"
        this.category = 'bot'
        this.cooldown = 120
    }
    run({ client, message, args, embedResponse }) {
        if (!args[0]) return embedResponse('<:cancel:804368628861763664> | Necesitas especificar el error/bug.')
        let embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`[📢] | ${args.join(' ')}`)
            .setTimestamp()
            .setAuthor(`${message.author.tag}(${message.author.id})`)
            .setFooter('Enviado desde ' + message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
        return client.channels.cache.get('725053091522805787').send({ embed: embed }).then(() => {
            return embedResponse('📢 | Reporte enviado!');
        })
    }
}