// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "balance"
        this.category = 'economy';
        this.alias = ['bal']
    }

    /**
     * 
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     * @param {Discord.Client} obj.client
     * @param {Array<String>} obj.args 
     * @param {Function} obj.embedResponse
     */

    async run(obj) {

        const { message } = obj

        await checkEconomy(message)

        let user = message.mentions.users.first() || message.author;

        const data = await economy_model.findOne({ id: user.id })

        if (!data)
            return sendEmbed({
                channel: message.channel,
                description: '<:cancel:804368628861763664> | Sin datos de **' + user.tag + '**.'
            })

        return sendEmbed({
            channel: message.channel,
            fields: [
                [
                    'Dinero',
                    data.money + icon_money,
                    true
                ],
                [
                    'Espacio en el banco',
                    data.maxSpace,
                    true
                ],
                [
                    'Banco',
                    data.bank + icon_money,
                    true
                ],
                [
                    'Escudos',
                    data.shields,
                    true
                ],
                [
                    'Mascota',
                    `${data.pet.name}(${data.pet.hability})`,
                    true
                ],
                [
                    'Bombas',
                    data.bombs,
                    true
                ]
            ],
            thumbnailURL: user.displayAvatarURL({ dynamic: true, size: 2048 }),
            authorText: `Balance de ${user.tag}`
        })

    }
};