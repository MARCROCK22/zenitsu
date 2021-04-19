const Discord = require('discord.js-light')
const mybo = require("myscrapper"),
    mybot = require('../../models/mybot')

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "portalmybot"
        this.alias = [`mybo`, `mybot`]
        this.category = 'utiles'
    }
    async run({ message, args, embedResponse, client }) {


        let buscar = args[0]
            ? (message.mentions.users.first()
                ? (await mybot.findOne({ id: message.mentions.users.first().id }))?.profile : args[0])
            : (await mybot.findOne({ id: message.author.id }))?.profile

        let { data } = await mybo.mybot(buscar);

        if (data.message)
            return embedResponse('<:cancel:804368628861763664> | ' + data.message)

        let embed = new Discord.MessageEmbed()
            .setColor(client.color)
            .setAuthor(data.nombre, data.avatar, `https://portalmybot.com/u/${buscar}`)
            .addField('Nivel', data.nivel, true)
            .addField('Biografia', data.biografia ? data.biografia.slice(0, 1000) : 'Sin biografia.', true)
            .addField("Numero de logros", data.logros.length, true)
            .addField('Numero de seguidores', data.seguidores, true)
            .addField('Puntos web', data.puntosWeb, true)
            .addField('Link del perfil', `https://portalmybot.com/u/${buscar}`, true)
            .addField('Logros', data.logros && data.logros.length >= 1 ? data.logros.join(', ').slice(0, 1000) : 'Sin logros.', true)
            .setFooter(`Ubicacion: ${data.ubicacion ? data.ubicacion.slice(0, 1000) : 'Sin especificar.'}`)
        return message.channel.send({ embed: embed }).catch(() => { });
    }
};