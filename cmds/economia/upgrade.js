// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "upgrade"
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

        let { money, pet: { hability: h } } = await checkEconomy(message)

        switch (args[0]) {
            case 'bank':

                if (money < 3500) {
                    return sendEmbed({
                        channel: message.channel,
                        description: '<:cancel:804368628861763664> | No tienes suficiente dinero, necesitas **3500**' + icon_money + '.'
                    })
                }

                await economy_model.updateOne({ id: message.author.id }, { $inc: { maxSpace: 1500, money: -3500 } });

                return sendEmbed({
                    channel: message.channel,
                    description: '<:accept:804368642913206313> | Ahora tienes **1500** más de espacio.'
                })

            case 'pet':

                if (money < 3500) {
                    return sendEmbed({
                        channel: message.channel,
                        description: '<:cancel:804368628861763664> | No tienes suficiente dinero, necesitas **3500**' + icon_money + '.'
                    })
                }

                if (h >= 15)
                    return sendEmbed({
                        channel: message.channel,
                        description: `<a:spinthink:804368278063415316> | Tu mascota ya es nivel **${h}**.`
                    })

                // eslint-disable-next-line no-case-declarations
                const { pet: { hability } } = await economy_model.findOneAndUpdate({ id: message.author.id }, { $inc: { 'pet.hability': 1, money: -3500 } }, { new: true });

                return sendEmbed({
                    channel: message.channel,
                    description: '<:accept:804368642913206313> | Ahora tu mascota es nivel **' + hability + '**.'
                })

            default:
                return sendEmbed({
                    channel: message.channel,
                    description: `¿Que quieres mejorar?\nz!upgrade pet/bank`
                })
        }
    }
};