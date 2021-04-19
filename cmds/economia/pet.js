// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { checkEconomy, sendEmbed } = require('../../Utils/Functions')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = 'pet'
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

        const { money, food, pet: { hours, name: nombre, hability } } = await checkEconomy(message);

        const name = args.slice(1).join(' '),
            caso = args[0];

        switch (caso) {
            case 'rename':

                if (money < 100)
                    return sendEmbed({
                        channel: message.channel,
                        description: `<:cancel:804368628861763664> | Necesitas tener **100**${icon_money}.`
                    })

                if (!name || !name.length)
                    return sendEmbed({
                        channel: message.channel,
                        description: `<:cancel:804368628861763664> | Tienes que elegir el nuevo nombre.`
                    })

                if (name.length >= 100)
                    return sendEmbed({
                        channel: message.channel,
                        description: `<:cancel:804368628861763664> | El nombre debe tener menos de 100 caracteres.`
                    })

                // eslint-disable-next-line no-case-declarations
                const { pet } = await economy_model.findOneAndUpdate({ id: message.author.id }, { $set: { 'pet.name': name }, $inc: { money: -100 } }, { new: true })

                return sendEmbed({
                    channel: message.channel,
                    description: `<:accept:804368642913206313> | Ahora tu mascota se llama ${pet.name}`
                })

            case 'view':

                // eslint-disable-next-line no-case-declarations
                let date = Date.now(),
                    h = (hours),
                    res = ~~(((h - date) / 864) / 1000),
                    embed = new Discord.MessageEmbed()
                        .setColor(message.client.color)
                        .addField('Nombre', nombre, true)
                        .addField('Nivel', hability, true)
                        .addField('Comida', food, true)
                        .addField('Energia', await barra(res, 100).catch(() => { }) || '**0**%')
                return message.channel.send({ embed })

            case 'feed':

                if (!food || 0 >= food)
                    return sendEmbed({
                        channel: message.channel,
                        description: `<:cancel:804368628861763664> | No tienes comida.`
                    })

                // eslint-disable-next-line no-case-declarations
                let data,
                    datee = Date.now()

                data = await economy_model.findOne({ id: message.author.id })

                // eslint-disable-next-line no-case-declarations
                let ress = ~~(((data.pet.hours - datee) / 864) / 1000)

                if (ress >= 90) {
                    return sendEmbed({
                        channel: message.channel,
                        description: `${data.pet.name} tiene más del 90% de su energia.`
                    })
                }

                if (Date.now() > hours)
                    data = await economy_model.findOneAndUpdate({ id: message.author.id }, {
                        $set: {
                            'pet.hours': Date.now() + require('ms')('2h')
                        },
                        $inc: {
                            food: -1
                        }
                    }, { new: true })
                else data = await economy_model.findOneAndUpdate({ id: message.author.id }, { $inc: { 'pet.hours': require('ms')('2h'), food: -1 } }, { new: true })

                // eslint-disable-next-line no-case-declarations
                ress = ~~(((data.pet.hours - datee) / 864) / 1000)

                return sendEmbed({
                    channel: message.channel,
                    fields: [
                        [
                            'Energia actual',
                            await barra(ress, 100).catch(() => { }) || '**0**%'
                        ]
                    ]
                })

            default:
                return sendEmbed({
                    channel: message.channel,
                    description: `¿Que quieres hacer?\nz!pet view\nz!pet rename [nombre]\nz!pet feed`
                })
        }
    }
};

// eslint-disable-next-line require-await
async function barra(valor, maximo) {
    const resultado = (valor * 100) / maximo;
    const porcentaje = resultado / 100;
    let cantidad = "15"
    const progreso = Math.round((cantidad * porcentaje));
    const vacio = cantidad - progreso;

    const texto1 = '▬'.repeat(progreso);
    const texto2 = ''.repeat(vacio);
    const texto3 = '**' + Math.round(porcentaje * 100) + '**%';

    const barra = '' + texto1 + texto2 + ' ' + texto3 + '';
    return barra;
}