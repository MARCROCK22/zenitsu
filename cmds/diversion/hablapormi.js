const { Command } = require('../../Utils/Classes'),
    { MessageEmbed } = require('discord.js')

module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "hablapormi"
        this.category = 'diversion'
        this.alias = ['hablaxmi']
        this.memberPermissions.guild = ['MANAGE_MESSAGES']
        this.botPermissions.channel = ['MANAGE_MESSAGES']
    }
    async run({ message }) {
        (await message.channel.send(new MessageEmbed().setColor(`RANDOM`).setDescription(`Hablando por **${message.author.tag}**\n||Usa \`cancel\` en cualquier momento para detener el comando||`).setTimestamp())).delete({ timeout: 10000 })

        let channel = message.mentions.channels.first() || message.channel

        let filter = (msg) => message.author.id == msg.author.id && msg.content,
            c = channel.createMessageCollector(filter, { time: 60000 })

        c.on('collect', (m) => {
            if (m.content.toLowerCase() === 'cancel') c.stop('cancel')
            let content = m.content //creo que esto no es necesario
            m.delete().catch((e) => { console.log(e) })
            channel.send(content, { allowedMentions: { parse: [] } })
        })
        c.on('end', (collected, reason) => {
            if (reason === 'cancel') {
                message.channel.send(new MessageEmbed().setColor(`RANDOM`).setDescription(`Cancelaste el comando!`).setTimestamp())
            } else if (reason === 'time') {
                message.channel.send(new MessageEmbed().setColor(`RANDOM`).setDescription(`El tiempo ha acabado!`).setTimestamp())
            } else {
                message.channel.send(new MessageEmbed().setColor(`RANDOM`).setDescription(`El comando se detuvo a causa de:\n\`\`\`js\n${reason}\`\`\``).setTimestamp())
            }
        })
    }
}