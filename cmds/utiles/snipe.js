const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "snipe"
        this.category = 'utiles'
    }
    async run({ client, message, embedResponse }) {

        let canal = message.mentions.channels.first() || message.channel;

        let data = (await client.getData({ id: canal.id }, 'snipe'))

        if (!data || !data.mensaje) return embedResponse("<:cancel:804368628861763664> | No he visto ningun mensaje borrarse en este canal.")

        let embed = new Discord.MessageEmbed()
            .setDescription(data.mensaje)
            .setAuthor(data.nombre, data.avatarURL)
            .setColor(client.color)
            .setTimestamp()
        return message.channel.send({ embed: embed }).catch(() => { })

    }
}
