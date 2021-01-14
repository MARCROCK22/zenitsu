const Discord = require('discord.js');
module.exports = {
    config: {
        name: "kiss", //nombre del cmd
        alias: [], //Alias
        description: "Manda un gif besando a alguien", //Descripción (OPCIONAL)
        usage: "z!kiss @mencion [Texto]",
        category: 'interacción',
        botPermissions: [],
        memberPermissions: []

    }, run: ({ client, message, embedResponse, args }) => {

        let link = client.star.kiss();
    
        let miembro = message.mentions.members.first();

        if (!miembro) return embedResponse('Tienes que mencionar a alguien!')

        let embed = new Discord.MessageEmbed()
            .setColor(client.color)
            .setDescription(`${message.author.toString()} besó a ${miembro.user.toString()}!${args[1] ? `\n${args.slice(1).join(' ')}` : ''}`)
            .setImage(link)
            .setTimestamp()

        return message.channel.send({ embed: embed }).catch(() => { });

    }
}
