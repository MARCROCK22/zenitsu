const Discord = require('discord.js-light');
const ms = require('ms');
const cooldowns = new Discord.Collection();
//let cooldownniveles = new Set();
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 */
module.exports = async (client, message) => {

    //const prefix = (await client.getData({ id: message.guild.id }, 'prefix')).prefix || 'z!';
    if (!message || !message.guild || !message.author) return;
    client.serverQueue = client.queue.get(message.guild.id);

    //client.updateData({ idMember: message.author.id, idGuild: message.guild.id }, { cacheName: message.author.tag }, 'niveles').catch(() => { })
    const prefix = message.guild.cachePrefix || await message.guild.getPrefix();
    message.guild.cachePrefix = prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase()

    if (message.author.bot) return;

    const afk = await message.author.fetchAfk()
    if (afk.status) {
        await message.author.deleteAfk()
        return message.reply('<:sesonroja:804750422828515339> | ¡Bienvenido de vuelta!')
    }

    for (let user of message.mentions.users.array().filter(e => !e.bot)) {
        if (!user.cacheAfk) {
            await user.fetchAfk();
        }
        if (user.cacheAfk && user.cacheAfk.status) {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setDescription(user.cacheAfk.reason)
                .setFooter('AFK | ' + require('moment')(user.cacheAfk.date).fromNow())

            message.channel.send({ embed }).catch(() => { })
            break;
        }
    }

    if (message.content.toLowerCase() == 'nezuko' || message.content.toLowerCase() == 'nezuko chan')
        return message.channel.send(`Nezuko chaaan!`);

    if (!message.content?.startsWith(prefix)) return;

    /*if (!message.member.hasPermission('ADMINISTRATOR') && settings.borrarInv && message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g)) {

        if (message.deletable) {

            message.delete()
            return embedResponse('No tienes permitido enviar invitaciones.')
                .then(a => { a.delete({ timeout: 5000 }).catch(() => { }) })
                .catch(() => { })

        }

    }*/

    let filter = e => {
        if (message.guild.id != '645463565813284865' && e.category == 'servidor') return false;
        else if (e.dev && (!(client.devseval.includes(message.author.id)))) return false;
        return true;
    }

    let commandfile = client.commands.filter(filter).get(command)
        || client.commands.filter(filter).find(item => item.alias.includes(command))
    if (commandfile) {

        if (!cooldowns.has(commandfile.name)) {
            cooldowns.set(commandfile.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(commandfile.name);
        const cooldownAmount = (commandfile.cooldown || 0) * 1000;

        if (!client.devseval.includes(message.author.id)) {
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`Por favor espera ${timeLeft.toFixed(1)} segundo(s) antes de usar \`${command}\`.`);
                }
            }

            else {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }

        let check = [];
        if (commandfile.botPermissions.channel?.length) {

            let permisos = message.channel.permissionsFor(message.guild.me);
            let permisosN = commandfile.botPermissions.channel;
            for await (let i of permisosN) {
                if (!permisos.has(i)) {
                    check.push(i);
                }
            }
        }

        if (check.length >= 1) {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('<:cancel:804368628861763664> | Ups, me faltan algun/algunos permiso(s) en el canal: `' + check.join(', ') + "`")
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = [];

        if (commandfile.memberPermissions.channel?.length) {

            let permisos = message.channel.permissionsFor(message.member);
            let permisosN = commandfile.memberPermissions.channel;
            for await (let i of permisosN) {
                if (!permisos.has(i)) {
                    check.push(i);
                }
            }
        }

        if (check.length >= 1) {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('<:cancel:804368628861763664> | Ups, te faltan algun/algunos permiso(s) en el canal: `' + check.join(', ') + "`")
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = [];
        if (commandfile.botPermissions.guild?.length) {

            let permisos = message.guild.me.permissions.toArray()
            let permisosN = commandfile.botPermissions.guild;
            for await (let i of permisosN) {
                if (!permisos.includes(i)) {
                    check.push(i);
                }
            }
        }

        if (check.length >= 1) {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('<:cancel:804368628861763664> | Ups, me faltan algun/algunos permiso(s) en el servidor: `' + check.join(', ') + "`")
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = [];

        if (commandfile.memberPermissions.guild?.length) {

            let permisos = message.member.permissions.toArray();
            let permisosN = commandfile.memberPermissions.guild;
            for await (let i of permisosN) {
                if (!permisos.includes(i)) {
                    check.push(i);
                }
            }
        }

        if (check.length >= 1) {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('<:cancel:804368628861763664> | Ups, te faltan algun/algunos permiso(s) en el servidor: `' + check.join(', ') + "`")
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        try {
            await commandfile.run({ client, message, args, embedResponse, Hora })
        } catch (err) {
            new Discord.WebhookClient(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN).send(
                new Discord.MessageEmbed()
                    .setColor(client.color)
                    .setTimestamp()
                    .setDescription(err.stack.slice(0, 2048))
                    .addField('Comando usado', command)
            )
            console.log(err.message || err.stderr || err)
            return message.channel.send({
                embed:
                    new Discord.MessageEmbed()
                        .setDescription('Ocurrio un error, reportalo en el servidor de [soporte](https://discord.gg/hbSahh8).')
                        .setColor(client.color)
                        .setThumbnail(`https://media1.tenor.com/images/9603c39870bd2d6c72fb748761279d87/tenor.gif?itemid=17682808`)
                        .setTimestamp()
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
            }).catch(() => { });
        }
    }

    /**
     * @async
     * @param {String} descriptionHere 
     * @param {Discord.TextChannel} option
     * @returns {Discord.Message} 
     */

    function embedResponse(descriptionHere, option) {

        let embed = new Discord.MessageEmbed()
            .setDescription(descriptionHere)
            .setTimestamp()
            .setColor(client.color);

        let canal = option || message.channel;

        return canal.send({ embed: embed })

    }

    function Hora(date = Date.now(), dia = false) {

        let fecha = new Date(date - ms('4h'))

        let hora = fecha.getHours();

        let minutos = fecha.getMinutes();

        let segundos = fecha.getSeconds();
        if (hora < 10) {
            hora = '0' + hora
        }

        if (minutos < 10) {
            minutos = '0' + minutos
        }
        if (segundos < 10) {
            segundos = "0" + segundos
        }
        if (!dia)
            return hora + ":" + minutos + ":" + segundos

        else {

            let dia = new Date(date - ms('4h')).getDay() + 1,
                mes = new Date(date - ms('4h')).getMonth() + 1,
                año = new Date(date - ms('4h')).getFullYear()

            return `${hora}:${minutos}:${segundos} - ${dia}/${mes}/${año}`

        }

    }

};
