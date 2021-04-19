
const Command = require('../../Utils/Classes').Command,
    Discord = require('discord.js-light')
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "guilds"
        this.category = 'bot'
    }
    /**
     * 
     * @param {Object} obj
     * @param {import('discord.js').Message} obj.message
     * @param {import('discord.js').Client} obj.client 
     */
    run(obj) {
        const { client, message } = obj;

        let embed = new Discord.MessageEmbed()
            .setColor(client.color)
            .setDescription(`Actualmente estoy en **${client.guilds.cache.size}** servidores y **${client.users.cache.size}** usuarios en cache.`)
            .setTimestamp()
            .setFooter(`Shard #${message.guild.shardID}`)

        return message.channel.send({ embed })
    }
}