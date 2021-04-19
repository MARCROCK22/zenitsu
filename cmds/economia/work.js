// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light'),
    chances = {
        1: 15,
        2: 20,
        3: 25,
        4: 35,
        5: 40,
        6: 45,
        7: 50,
        8: 60,
        9: 65,
        10: 70,
        11: 75,
        12: 80,
        13: 85,
        14: 90,
        15: 100
    },
    economy_model = require('../../models/economy'),
    icon_money = `<:monedaZenitsu:808837174031024208>`,
    { generarNumero: generarDinero, generarNumero, checkEconomy, sendEmbed, checkCooldown } = require('../../Utils/Functions'),
    frases = [
        'Trabajaste para mi creador haciendo nuevos comandos 😳, te dio **{MONEY}**.',
        'Ayudaste a BrunoRM con su bot, te dio: **{MONEY}**.',
        'Trabajaste para Awoo, te dio: **{MONEY}** (Awoo te pagó para que consigas información de bots 🤫).',
        'Ayudaste en #soporte-discord, toma ~~puntos de ayuda~~: **{MONEY}**.',
        'Hypnotic te ascendio a staff, te dio **{MONEY}** por ser tu primer dia.',
        'Te encontraste 200 pesos al lado de un vagabundo, como eres buena gente le das una parte y te quedas con: **{MONEY}**.',
        'Reportaste varios Bots bug, Aviii te agradece con: **{MONEY}**.',
        'Le conseguiste un buen avatar a Adrian, te premia con: **{MONEY}**.',
        'zPablo te dio **{MONEY}** para una hamburguesa, pero tu te lo guardas.',
        'El pana miguel es muy generoso, el pana miguel te da: **{MONEY}**.',
        'Zor, Zor facha, Zor te entrega **{MONEY}**, agradecele a Zor.',
        'Basman quiere que le muestres tu flow, a cambio te dio: **{MONEY}**.',
        'Ayudaste a TheEaterOfSouls con su bot, te dio: **{MONEY}**.',
        'Ayudaste a AndreMor mejorando errores en su Github, te premia con: **{MONEY}**.',
        '\\*Inserte frase acá, te dio: **{MONEY}**\\*.',
        'Leri quiere tener un frase, a cambio te dio **{MONEY}**.',
        'Trabajaste para himura, te dio: **{MONEY}**.',
        'Ilias te pago para que seas su esclavo, te dio: **{MONEY}**.',
        'Ro_CrackGamer quiere contratarte para bailar, aceptas y te da **{MONEY}**.',
        'Descubriste a Ahzucar simpeando a alguien, te descubre y te da **{MONEY}** para que no digas nada.',
        'Vendiste porros para Arroz y te pagó **{MONEY}** 😈.'
    ];

function generarFrase() {

    return frases[Math.floor(Math.random() * frases.length)]

}

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "work"
        this.category = 'economy'
        this.cooldown = 0;
    }

    /**
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     * @param {Discord.Client} obj.client
     * @param {Array<String>} obj.args 
     * @param {Function} obj.embedResponse
     */

    async run(obj) {

        const { message, embedResponse } = obj

        let culdaun = checkCooldown(message);

        if (culdaun)
            return embedResponse(`<a:waiting:804396292793040987> | Espera ${(culdaun.get(message.author.id) - Date.now()) / 1000}s para volver a trabajar.`)

        const { pet: { name, hability, hours } } = await checkEconomy(message)
        let coins = generarDinero(25, 200),
            total = coins,
            res = {
                channel: message.channel,
                description: generarFrase().replace('{MONEY}', coins + icon_money)
            },
            chance = generarNumero(0, 100);

        if (Date.now() > hours) {
            res.footerText = `Tu mascota ${name} está cansada.`
        }

        else if (chances[hability] >= chance) {
            total += Math.round((coins * hability) / 20)
            res.footerText = `¡Tu mascota ${name} ha cazado!, Toma ${total - coins}💰 más.`
        }

        await economy_model.updateOne({ id: message.author.id }, { $inc: { money: total }, $set: { cacheName: message.author.tag } })
        return sendEmbed(res);
    }
};