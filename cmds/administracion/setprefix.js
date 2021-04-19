const { MessageEmbed } = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "setprefix"
        this.alias = []
        this.category = 'administracion'
        this.botPermissions = { guild: [], channel: [] }
        this.memberPermissions = { guild: ['ADMINISTRATOR'], channel: [] }
    }
    run({ client, message, args }) {

        let embedErr = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`<:cancel:804368628861763664> | Necesitas especificar el prefijo nuevo.`)
            .setTimestamp()

        if (!args[0])
            return message.channel.send({ embed: embedErr })

        let embedE = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`<:cancel:804368628861763664> | El prefix debe tener menos de 3 caracteres.`)
            .setTimestamp()

        if (args[0].length >= 4)
            return message.channel.send({ embed: embedE })

        return client.updateData({ id: message.guild.id }, { prefix: args[0] }, 'prefix').then(data => {

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<:trustedAdmin:804368672520536104> | ${message.author.username} ha establecido el prefijo a: ${data.prefix}`)
                .setTimestamp()
            message.guild.cachePrefix = data.prefix
            return message.channel.send({ embed: embed })

        }).catch(err => {

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<:cancel:804368628861763664> | Error al establecer el prefijo.`)
                .setTimestamp()
                .setFooter(err)

            return message.channel.send({ embed: embed })

        })
    }
}