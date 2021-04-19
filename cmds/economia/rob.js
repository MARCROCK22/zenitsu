const culdaun = new Map()
function checkCooldown(message) {

    if (culdaun.has(message.author.id) && Date.now() <= culdaun.get(message.author.id))
        return culdaun;

    if (!culdaun.has(message.author.id)) {
        culdaun.set(message.author.id, Date.now() + require("ms")('2m'))
        setTimeout(() => {
            culdaun.delete(message.author.id)
        }, require('ms')('2m'))
        return false;
    }

}

// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { generarNumero: generarDinero, generarNumero, checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "rob"
        this.category = 'economy'
        this.cooldown = 0
    }

    /**
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     * @param {Discord.Client} obj.client
     * @param {Array<String>} obj.args 
     * @param {Function} obj.embedResponse
     */

    async run(obj) {

        const { message, embedResponse, args, client } = obj

        let user = client.users.cache.get(args[0]) || (args[0] ? await client.users.fetch(args[0]).catch(() => { }) : null) || message.mentions.users.first();

        if (!user)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | Necesitas mencionar a un usuario.`
            })

        if (user.id == message.author.id)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | No te puedes robar a ti mismo.`
            })

        let { money } = await checkEconomy(message)

        const data_mention = await economy_model.findOne({ id: user.id });

        if (!data_mention)
            return embedResponse(`<:cancel:804368628861763664> | Sin datos sobre **${user.tag}**.`)

        let coins = generarDinero(300, 900);

        let chance = () => generarNumero(0, 100);

        if (data_mention.money < 1000)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | **${user.tag}** tiene menos de **1000**${icon_money}.`
            })

        if (money < 1000)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | Tienes menos de **1000**${icon_money}, no puedes robar.`
            })

        let culdaunn = checkCooldown(message);

        if (culdaunn)
            return embedResponse(`<a:waiting:804396292793040987> | Espera ${(culdaunn.get(message.author.id) - Date.now()) / 1000}s para volver a robar.`)

        if (45 > chance()) {
            await economy_model.updateOne({ id: message.author.id }, { $inc: { money: ~~((-coins) / 2) } })
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | Al intentar robar a **${user.tag}** te atraparon intentando escaparte, perdiste: **${~~(coins / 2)}**${icon_money}.`
            })
        }

        else {

            await economy_model.updateOne({ id: message.author.id }, { $inc: { money: ~~coins } })
            await economy_model.updateOne({ id: user.id }, { $inc: { money: ~~(-coins) } })
            return sendEmbed({
                channel: message.channel,
                description: `<:noice:804368487564312627> | Al entrar en la casa de **${user.tag}** haz conseguido robar: **${~~coins}**${icon_money}.`
            })

        }
    }
};