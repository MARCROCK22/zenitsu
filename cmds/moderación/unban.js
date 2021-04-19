// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "unban"
        this.category = 'moderacion'
        this.botPermissions.guild = ['BAN_MEMBERS', 'MANAGE_MESSAGES', 'ADD_REACTIONS']
        this.memberPermissions.guild = ['BAN_MEMBERS'];
    }

    /**
    * @param {Object} obj
    * @param {Discord.Client} obj.client
    * @param {Discord.Message} obj.message
    * @param {Array<String>} obj.args
    */

    run(obj) {
        const { message, embedResponse } = obj;

        return message.guild.fetchBans().then(async bans => {
            if (!bans.size)
                return embedResponse('<:cancel:804368628861763664> | Este servidor no tiene usuarios baneados.')
            let i = 0
            let pagina = 0;
            const arraybans = bans.array()
            bans = bans.map((ban) => '[' + (++i) + '] ' + message.client.remplazar(ban.user.tag))
            bans = funcionPagina(bans, 20)
            let embed = new Discord.MessageEmbed()
                .setColor(message.client.color)
                .setDescription(bans[0].join('\n'))
                .setTimestamp()
                .setFooter(`Escribe [n] para pasar a la siguiente pagina y [b] para retroceder [Pagina: (${pagina + 1}/${bans.length})]`)
            let msg = await message.channel.send({ embed: embed })

            const colector = message.channel.createMessageCollector((m) => (m.author.id == message.author.id), { time: 300000, idle: 60000 * 2 })

            let cooldown = false;

            colector.on('collect', col => {

                if (cooldown) {
                    return;
                }

                else {
                    cooldown = true
                    setTimeout(() => {
                        cooldown = false;
                    }, 2000)
                }

                const { content } = col;

                switch (content.toLowerCase()) {

                    case 'n': {
                        if (bans[pagina + 1]) {
                            pagina += 1
                            let embed = new Discord.MessageEmbed()
                                .setColor(message.client.color)
                                .setDescription(bans[pagina].join('\n'))
                                .setTimestamp()
                                .setFooter(`Escribe [n] para pasar a la siguiente pagina y [b] para retroceder [Pagina: (${pagina + 1}/${bans.length})]`)
                            msg.edit({ embed })
                        }
                        break;
                    }
                    case 'b': {
                        if (bans[pagina - 1]) {
                            pagina -= 1
                            let embed = new Discord.MessageEmbed()
                                .setColor(message.client.color)
                                .setDescription(bans[pagina].join('\n'))
                                .setTimestamp()
                                .setFooter(`Escribe [n] para pasar a la siguiente pagina y [b] para retroceder [Pagina: (${pagina + 1}/${bans.length})]`)
                            msg.edit({ embed })
                        }
                    }
                }

                if (parseInt(content) && arraybans[parseInt(content) - 1]) {

                    const filter = (reaction, user) => ['804368642913206313', '804368628861763664'].includes(reaction.emoji.id) && user.id === message.author.id
                    colector.stop()
                    return embedResponse(`<a:CatLoad:804368444526297109> | ¿Estas seguro de que quieres desbanear a: **${message.client.remplazar(arraybans[parseInt(content) - 1].user.tag)}** ?`)
                        .then(async msgg => {
                            const si = '804368642913206313',
                                no = '804368628861763664'

                            await msgg.react(si);
                            await msgg.react(no);

                            msgg.awaitReactions(filter, { max: 1, time: 60000 })
                                .then(col => {

                                    const { emoji: { id } } = col.array()[0]

                                    if (id == no) {
                                        return embedResponse('<a:CatLoad:804368444526297109> | Si te has equivocado vuelve a intentarlo ejecutando otra vez el comando.')
                                    }

                                    else if (id == si) {
                                        let usuarioParaDesbanear = arraybans[parseInt(content) - 1]
                                        return message.guild.members.unban(usuarioParaDesbanear.user.id, 'Desbaneado por: ' + message.author.tag)
                                            .then(() => {
                                                return embedResponse(`<:noice:804368487564312627> | Usuario desbaneado. **[${message.client.remplazar(message.client.remplazar(usuarioParaDesbanear.user.tag))}]**`)
                                            })
                                            .catch(() => {
                                                return embedResponse(`<a:CatLoad:804368444526297109> | Error al intentar desbanear a **${message.client.remplazar(usuarioParaDesbanear.user.tag)}**`)
                                            })
                                    }

                                }).catch(() => {
                                    let embed = new Discord.MessageEmbed()
                                        .setColor(message.client.color)
                                        .setTimestamp()
                                        .setDescription('<a:gatomordedor:804368768704577548> | Pasó un minuto y no te has decidido.')
                                    return message.channel.send({ embed })
                                })
                        })
                }
                if (col.content.toLowerCase().includes('unban'))
                    return colector.stop()
            });
        })
            .catch(() => {

                let embed = new Discord.MessageEmbed()
                    .setDescription('<:cancel:804368628861763664> | Error al intentar ver los usuarios baneados')
                    .setTimestamp()
                    .setColor(message.client.color)

                message.channel.send({ embed })

            })
    }
}

/**
 * 
 * @param {Array} elArray 
 * @param {Number} num
 * @returns {Array<Array<String>>} 
 */

function funcionPagina(elArray, num = 10) {
    let pagina = [];
    for (let i = 0; i < elArray.length; i += num) {
        pagina.push(elArray.slice(i, i + num))
    }
    return pagina;
}