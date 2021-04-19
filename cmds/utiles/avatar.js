
const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "avatar"
        this.category = 'utiles'
    }
    run({ client, message, args }) {

        let miembro = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.guild.members.cache.find(a => a.user.username === args.join(' ')) || message.guild.members.cache.find(a => a.user.tag === args.join(' ')) || message.guild.members.cache.find(a => a.displayName === args.join(' ')) || message.member;

        let avatar = miembro.user.displayAvatarURL({ dynamic: true, size: 2048 })

        let buscarG = `https://www.google.com/searchbyimage?image_url=${avatar}`

        let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`Avatar de ${miembro.user.tag}`)
            .setColor(client.color)
            .setImage(avatar)
            .setFooter(`Pedido por ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048, dynamic: true }))
            .setDescription(`<:member:804368573186441237> [Link avatar](${avatar})\n🌐 [Búscalo en google](${buscarG})`)
        return message.channel.send({ embed: embed }).catch(() => { });

    }
};