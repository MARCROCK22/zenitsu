const Discord = require('discord.js-light');
const { sendEmbed } = require('../../Utils/Functions')
const Command = require('../../Utils/Classes').Command
const { Readable } = require('stream')
function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
}
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "tts"
        this.category = 'utiles'
        this.botPermissions.guild = ['ATTACH_FILES']
        this.cooldown = 15;

    }

    /**
     * 
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     */

    async run(obj) {

        const { message, args, embedResponse } = obj;

        let str = args.join(' ')
            ?.split('🇵🇾')?.join('Ese país no existe')
            ?.split('🥑')?.join('palta')
            ?.split(';').join('Símbolo restringido por Awoo')
            ?.split('😳').join('asteriscos Se flushea asteriscos');

        if (!str)
            return embedResponse('<:cancel:804368628861763664> | Necesitas ingresar un texto.')

        sendEmbed({
            channel: message.channel,
            description: `<a:CatLoad:804368444526297109> | Esto puede tardar un momento.`
        })

        if (str.length >= 200) {

            let array = Discord.Util.splitMessage(str, { char: '', maxLength: 190 }),
                buffers = [];
            for (let str of array) {
                let link = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=64&client=tw-ob&q=${encodeURIComponent(str)}&tl=es`

                const fetch = require('node-fetch');
                let buffer = await (await fetch(link)).buffer()
                buffers.push(buffer)
            }

            if (message.member.voice.channel && message.member.voice.channel.permissionsFor(message.guild.me).has('CONNECT') && message.member.voice.channel.permissionsFor(message.guild.me).has('SPEAK'))
                return message.member.voice.channel.join().then((voice) => voice.play(bufferToStream(Buffer.concat(buffers))))

            return message.channel.send({
                files: [
                    {
                        attachment: Buffer.concat(buffers),
                        name: 'audio.mp3'
                    }
                ]
            })
        }

        else {
            let link = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=64&client=tw-ob&q=${encodeURIComponent(str)}&tl=es`

            if (message.member.voice.channel && message.member.voice.channel.permissionsFor(message.guild.me).has('CONNECT') && message.member.voice.channel.permissionsFor(message.guild.me).has('SPEAK'))
                return message.member.voice.channel.join().then((voice) => voice.play(link))

            let att = new Discord.MessageAttachment(link, 'audio.mp3');
            return message.channel.send({ files: [att] })
        }

    }
}