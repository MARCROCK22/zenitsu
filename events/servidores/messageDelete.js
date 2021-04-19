/**
 * 
 * @param {import('discord.js-light').Client} client 
 * @param {import('discord.js-light').Message} message 
 */
module.exports = async (client, message) => {
    if (!message) return;
    if (!message.author) return;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content) {
        await client.updateData({ id: message.channel.id }, { date: Date.now(), nombre: message.author.tag, avatarURL: message.author.displayAvatarURL({ dynamic: true }), mensaje: message.content }, 'snipe').catch(() => { })
    }
};