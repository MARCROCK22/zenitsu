const Discord = require('discord.js-light');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "profile"
        this.category = 'diversion'
    }
    async run({ client, message, args }) {

        let member = message.guild.members.cache.find(a => a.user.username === args.join(' ')) || message.guild.members.cache.find(a => a.user.tag === args.join(' ')) || message.guild.members.cache.find(a => a.displayName === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

        let data = (await client.getData({ id: member.user.id }, 'profile'));

        let { color, description, insignias, img, thumbnail, nick, footer, footertext } = data;

        let guild = client.guilds.cache.get('645463565813284865');

        if (guild && guild.members.cache.get(member.user.id)) {
            insignias.push(`<:zDiscordMember:766650472508817448>`)
        }

        let embed = new Discord.MessageEmbed()
            .setImage(img)
            .setThumbnail(thumbnail)
            .setAuthor(`Perfil de ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
            .addField(`Descripción`, description)
            .addField('Insignias', insignias.length == 0 ? 'No tiene insignias.' : insignias.join(' '))
            .addField('Apodo', nick)
            .setFooter(footertext, footer)
            .setTimestamp()
        return message.channel.send({ embed: embed })
    }
}