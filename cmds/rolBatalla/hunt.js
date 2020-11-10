const statusA = new Map();
const Discord = require('discord.js');
module.exports = {
    config: {
        name: "hunt",//Nombre del cmd
        alias: [], //Alias
        description: "Cazar demonios", //Descripción (OPCIONAL)
        usage: "z!hunt",
        category: 'rol'

    }, run: async ({ client, message, args, embedResponse, Hora }) => {
        let data = await client.getData({ id: message.author.id }, 'demonios')
        let { monstruos, nivelenemigo, nivelespada, nivelusuario, xpusuario, cooldown } = data;

        let elcoso = Math.floor(nivelespada / 10);
        let multiplica = []

        for (var i = 0; elcoso > 0; i++) {
            multiplica.push('n')
            elcoso--
        }

        let reto = (multiplica.length * 15) + 50

        if (cooldown > Date.now())
            return embedResponse('No puedo ir a cazar ahora.\n\nTiempo restante: ' + require('ms')(cooldown - Date.now()))

        if (!statusA.get(message.author.id)) {

            statusA.set(message.author.id, { status: true });

        }

        else {
            return embedResponse('Ya estas cazando demonios!')
        }

        let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setDescription('Buscando a un demonio ⚔️!')
            .setTimestamp()
            .setThumbnail('https://media1.tenor.com/images/89f8120f72fd144b0f4639486657afb3/tenor.gif?itemid=15330449')

        await client.updateData({ id: message.author.id }, { cooldown: Date.now() + require('ms')('30s') }, 'demonios');

        message.channel.send({ embed: embed1 }).catch(e => { })

        await Discord.Util.delayFor(5000);

        let dinero = Math.floor(Math.random() * 14) + 1;

        let exp = Math.floor(Math.random() * 4) + 1;

        let datazo = await client.updateData({ id: message.author.id }, { $inc: { monstruos: 1, dinero: dinero, xpusuario: exp } }, 'demonios')

        if (xpusuario + exp < reto) {

            let embed2 = new Discord.MessageEmbed()
                .setColor(client.color)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Has cazado un demonio (total: ${datazo.monstruos})\n\nRecompensas: ${dinero}$ y ${exp} de experiencia!`)
                .setTimestamp()
                .setThumbnail('https://media1.tenor.com/images/ff57d6cb909d69f9c6f7b2ff590f1f19/tenor.gif?itemid=15100391')

            statusA.delete(message.author.id);

            return message.channel.send({ embed: embed2 }).catch(e => { })
        }

        else {

            await client.updateData({ id: message.author.id }, { $inc: { nivelusuario: 1, nivelespada: 1 } }, 'demonios')
            let dataz = await client.updateData({ id: message.author.id }, { xpusuario: 0 }, 'demonios');

            let embed3 = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('Subiste al nivel ' + dataz.nivelusuario + '!')
                .setTimestamp()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail('https://media1.tenor.com/images/c0011b22ef40718152484c7e11fd4b6d/tenor.gif?itemid=14677284')

            statusA.delete(message.author.id);

            return message.channel.send({ embed: embed3 }).catch(e => { })
        }
    }
}
