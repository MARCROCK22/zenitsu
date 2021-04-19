const { MessageEmbed } = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "resetwarns"
        this.category = 'moderacion'
        this.memberPermissions = { guild: ['ADMINISTRATOR'], channel: [] }
    }
    async run({ message, embedResponse, client }) {

        let member = message.mentions.members.first();

        if (!member) return embedResponse('<:cancel:804368628861763664> | Menciona a un miembro del servidor.')

        await require('../../models/warns.js').deleteOne({ idGuild: message.guild.id, idMember: member.id });

        let embed = new MessageEmbed()
            .setDescription(`📢 | Ahora ${member.toString()} tiene 0 advertencias.`)
            .setFooter(`Advertencias reseteadas por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setColor(client.color)
        return message.channel.send({ embed: embed })

    }
}