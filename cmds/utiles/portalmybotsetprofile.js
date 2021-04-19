// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light')
const mybo = require("myscrapper");
const { sendEmbed } = require('../../Utils/Functions')
const model = require('../../models/mybot');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "portalmybotsetprofile"
        this.alias = [`mybosetprofile`, `mybotsetprofile`]
        this.category = 'utiles'
    }

    async run({ message, args, embedResponse }) {

        if (!args[0] || args[0].length < 3 || args[0].length > 25) return embedResponse('<:cancel:804368628861763664> | Elige un nombre para establecerlo, debe tener más de 3 caracteres y menos de 25 caracteres.');

        let { data } = await mybo.mybot(args[0]);

        if (data.message) return sendEmbed({
            channel: message.channel,
            description: data.message
        })

        let datazo = await model.findOneAndUpdate({ id: message.author.id }, { profile: args[0] }, { new: true })

        if (!datazo) datazo = await model.create({
            id: message.author.id,
            profile: args[0]
        });

        return sendEmbed({
            channel: message.channel,
            description: `Establecido a \`${datazo.profile}\`.`
        })

    }
};