
//Después de Alias es opcional.
module.exports = {
    config: {
        name: "settings", //nombre del cmd
        alias: [], //Alias
        description: "Configurar opciones", //Descripción (OPCIONAL)
        usage: "...",
        category: 'administracion'
    },
    run: async ({ client, message, args, embedResponse }) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return embedResponse("No tienes el permiso `ADMINISTRATOR`")

        //await client.updateData({ id: message.guild.id }, { channellogs: channel.id }, 'settings')

        switch (args[0]) {

            case 'maxwarns':

                if (!args[1] || !Number(args[1]))
                    return embedResponse('Elige un numero.')

                if (parseInt(args[1]) <= 1)
                    return embedResponse('No puedes establecer un numero menor o igual que 1.');

                if (parseInt(args[1]) > 25)
                    return embedResponse('No puedes establecer un numero mayor a 25.');

                // eslint-disable-next-line no-case-declarations
                let data = await client.updateData({ id: message.guild.id }, { warnsParaKickear: Number(args[1]) }, 'settings');

                return embedResponse('Ahora para ser expulsado se necesitan ' + data.warnsParaKickear + ' advertencias.')

            case 'showlevel':

                // eslint-disable-next-line no-case-declarations
                let idk = async (bol) => { return await client.updateData({ id: message.guild.id }, { mostrarAnuncio: bol }, 'settings'); };

                if (args[1] == 'on') {
                    await idk(true);
                    return embedResponse('Ahora se podra ver el anuncio del nivel.')
                }

                else if (args[1] == 'off') {
                    await idk(false);
                    return embedResponse('Ahora no se podrá ver el anuncio del nivel.')
                }

                else {
                    embedResponse('Elige entre on y off.\nEjemplo: z!settings showlevel off');
                }

                break;

            case 'levelsystem':


                // eslint-disable-next-line no-case-declarations
                let idk1 = async (bol) => { return await client.updateData({ id: message.guild.id }, { sistemaDeNiveles: bol }, 'settings'); };

                if (args[1] == 'on') {
                    await idk1(true);
                    return embedResponse('Ahora el sistema de niveles funciona.')
                }

                else if (args[1] == 'off') {
                    await idk1(false);
                    return embedResponse('Ahora el sistema de niveles no funciona.')
                }

                else {
                    embedResponse('Elije entre on y off.\nEjemplo: z!settings levelsystem off');
                }

                break;


            case 'invs':


                // eslint-disable-next-line no-case-declarations
                let idk2 = async (bol) => { return await client.updateData({ id: message.guild.id }, { borrarInv: bol }, 'settings'); };

                if (args[1] == 'on') {
                    await idk2(true);
                    return embedResponse('Ahora se borraran las invitaciones.')
                }

                else if (args[1] == 'off') {
                    await idk2(false);
                    return embedResponse('Ahora el bot ignorara las invitaciones.')
                }

                else {
                    embedResponse('Elije entre on y off.\nEjemplo: z!settings invs on');
                }

                break;


            default:
                return embedResponse('Elije entre: levelsystem, showlevel, invs o maxwarns.\nEjemplo de uso: z!settings maxwarns 10')
        }
    }
}
