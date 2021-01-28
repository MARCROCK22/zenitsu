class Options {
    /**
    * @param {Object} data
    * @param {String} data.imageURL
    * @param {String} data.footerText
    * @param {String} data.footerLink
    * @param {String} data.title
    * @param {String} data.description
    * @param {import('discord.js').TextChannel} data.channel
    * @param {String} data.color
    * @param {String} data.thumbnailURL
    * @param {String} data.authorText
    * @param {String} data.authorLink
    * @param {String} data.authorURL
    * @param {Array} data.fields
    * @param {String} data.titleURL
    * @param {Array<(String|Buffer|import('discord.js').MessageAttachment|import('discord.js').FileOptions>}
    */

    constructor(data = {}) {
        this.imageURL = data.imageURL;
        this.footerText = data.footerText;
        this.footerLink = data.footerLink;
        this.title = data.title;
        this.description = data.description;
        this.channel = data.channel;
        this.color = data.color ? data.color : '#E09E36';
        this.thumbnailURL = data.thumbnailURL;
        this.authorText = data.authorText;
        this.authorLink = data.authorLink;
        this.authorURL = data.authorURL;
        this.fields = data.fields;
        this.titleURL = data.titleURL
        this.attachFiles = data.attachFiles
    }

}
class Command {

    constructor() {

        /**@type {Boolean}*/
        this.dev = false;
        /**@type {Array<String>} */
        this.alias = []
        /**@type {String}*/
        this.name = 'NO_NAME_COMMAND'
        /**@type {String}*/
        this.category = 'none'
        //ARREGLAR PERMISOS
        this.botPermissions = {
            /**@type {Array<String>}*/
            guild: [],
            /**@type {Array<String>}*/
            channel: []
        }
        /**@type {Number}*/
        this.cooldown = 4;

        this.memberPermissions = {
            /**@type {Array<String>}*/
            guild: [],
            /**@type {Array<String>}*/
            channel: []
        }
    }
    /**
     * @returns {(Promise<(import('discord.js').Message|Object)>|void)}
    */
    run() { }
}

module.exports = {
    Command,
    embedOptions: Options
}