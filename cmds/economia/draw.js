// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = 'draw'
        this.category = 'economy'
    }

    /**
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     * @param {Discord.Client} obj.client
     * @param {Array<String>} obj.args 
     * @param {Function} obj.embedResponse
     */

    async run(obj) {


        const { message, args } = obj;

        const { bank } = await checkEconomy(message);

        const [dinero] = args;

        if (isNaN(dinero) || ~~(parseInt(dinero)) <= 0)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | Necesitas ingresar un numero valido.`
            })

        if (~~(parseInt(dinero)) > bank)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:804368628861763664> | Haz ingresado un numero mayor a tu dinero en el banco.`
            })

        await economy_model.updateOne({ id: message.author.id }, { $inc: { bank: ~~(-dinero), money: ~~(dinero) } })

        return sendEmbed({
            channel: message.channel,
            description: `<:accept:804368642913206313> | **${~~(dinero)}**${icon_money} sacado del banco.`
        })

    }
};