const { readdirSync } = require("fs")
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js-light')
/**
 * 
 * @param {Discord.Client} client 
 */
module.exports = (client) => {
    function load(dirs) {
        const events = readdirSync(`./events/${dirs}/`).filter(d => {
            return d.endsWith('.js');
        });
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            console.log(eName, evt)
            client.on(eName, evt.bind(null, client));
        }
    }
    ["cliente", "servidores"].map(x => {
        return load(x);
    });
};
