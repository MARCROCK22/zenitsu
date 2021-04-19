// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light');
const { AmongUs } = require('../../Utils/Functions');
const model = require('../../models/amongus');
/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.MessageReaction} reaction
 * @param {Discord.User} user 
 */
module.exports = async (client, reaction, user) => {

    const data = await model.findOne({ idGuild: reaction.message.guild?.id, idMessage: reaction.message.id });

    if (reaction.message.partial) reaction.message = await reaction.message.fetch().catch(() => { });
    if (!reaction.message) return;
    if (!data) return;

    switch (reaction.emoji.id) {

        case '807729858649391105': {
            AmongUs({
                guild: reaction.message.guild,
                VoiceChannel: reaction.message.guild.member(user).voice.channel,
                memberRoles: reaction.message.guild.member(user).roles.cache,
                whichAction: 'mute'
            });
            break;
        }

        case '807729857693876224': {
            AmongUs({
                guild: reaction.message.guild,
                VoiceChannel: reaction.message.guild.member(user).voice.channel,
                memberRoles: reaction.message.guild.member(user).roles.cache,
                whichAction: 'unmute'
            });
            break;
        }

    }
}