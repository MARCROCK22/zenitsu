/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
const Discord = require('discord.js-light');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "top"
        this.alias = ['lb', 'leaderboard']
        this.category = 'niveles'
    }
    async run({ client, message, args, embedResponse }) {
        let seleccion = parseInt(args[0]) || 1;

        const { color } = client;
        let ress = await require('../../models/economy').find()
        ress.sort((a, b) => (b.money + b.bank) - (a.money + a.bank))
        if (ress.length === 0) return embedResponse("🤔 | Parece que nadie ha jugado esto.")
        let paginaa = ress.slice(10 * (seleccion - 1), 10 * seleccion);
        let embedd = new Discord.MessageEmbed()
            .setDescription(client.remplazar(
                paginaa.map((v, i) => {

                    let I = (i + 1) + 10 * (seleccion <= 0 ? 1 : seleccion - 1);

                    return `${I} | ${I == 1 && i == 0 || I == 2 && i == 1 || I == 3 && i == 2 ? '[👑] ' : ''}${!client.users.cache.get(v.id) ? v.cacheName == '' ? 'Miembro desconocido.' : v.cacheName : client.users.cache.get(v.id).tag} - ${v.money}(${v.bank})`

                }).join('\n') || `<:cancel:779536630041280522> | En la pagina ${seleccion} no hay datos.`
            )
            )
            .setTimestamp()
            .setFooter(`Pagina actual: ${seleccion <= 0 ? 1 : seleccion} de ${Math.round(ress.length / 10) || 1}`)
            .setColor(color)

        return message.channel.send({ embed: embedd }).catch(() => { })
    }
}