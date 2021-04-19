// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "buy"
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

        const { message, args } = obj

        let { money, items } = await checkEconomy(message)

        switch (args[0]) {

            case 'shield':
                if (money < 2000) {
                    return sendEmbed({
                        channel: message.channel,
                        description: '<:cancel:804368628861763664> | No tienes suficiente dinero, necesitas **2000**' + icon_money + '.'
                    })
                }

                // eslint-disable-next-line no-case-declarations
                const { shields } = await economy_model.findOneAndUpdate({ id: message.author.id }, { $inc: { shields: 1, money: -2000 } }, { new: true });

                return sendEmbed({
                    channel: message.channel,
                    description: '<:accept:804368642913206313> | Ahora tienes **' + shields + '** escudos.'
                })

            case 'bomb':
                if (money < 1000) {
                    return sendEmbed({
                        channel: message.channel,
                        description: '<:cancel:804368628861763664> | No tienes suficiente dinero, necesitas **1000**' + icon_money + '.'
                    })
                }

                // eslint-disable-next-line no-case-declarations
                const { bombs } = await economy_model.findOneAndUpdate({ id: message.author.id }, { $inc: { bombs: 1, money: -1000 } }, { new: true });

                return sendEmbed({
                    channel: message.channel,
                    description: '<:accept:804368642913206313> | Ahora tienes **' + bombs + '** bombas.'
                })

            case 'gun':
                if (money < 3000) {
                    return sendEmbed({
                        channel: message.channel,
                        description: '<:cancel:804368628861763664> | No tienes suficiente dinero, necesitas **3000**' + icon_money + '.'
                    })
                }

                if (items.includes('gun')) return sendEmbed({
                    channel: message.channel,
                    description: `<:noice:804368487564312627> | Ya te habias comprado el arma.`
                })

                await economy_model.findOneAndUpdate({ id: message.author.id }, { $addToSet: { items: 'gun' }, $inc: { money: -3000 } }, { new: true })

                return sendEmbed({
                    channel: message.channel,
                    description: `<:accept:804368642913206313> | Te has comprado el arma por **3000**${icon_money}.`
                })

            default:
                return sendEmbed({
                    channel: message.channel,
                    description: `¿Que quieres comprar?\nz!buy bomb/shield/gun`
                })
        }
    }
};