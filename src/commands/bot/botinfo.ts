import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import eris from 'eris-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import ms from '@fabricio-191/ms';
import os from 'os';

class Comando extends Command {
    constructor() {
        super();
        this.name = 'botinfo'
        this.category = 'bot'
    }

    async run({ client, message, langjson }: commandinterface): Promise<eris.Message> {
      
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setAuthor('Bot information')
          .setDescription('A Discord bot in spanish and english for para fun and moderation.')
          .addField('Bot information', `\`\`\`Developer: Lil MARCROCK22#2222 \nLibrary: eris-pluris^${eris.VERSION} \nLanguage: TypeScript \n Guilds: ${client.guilds.size} \nUsers (cached): ${client.users.size}\`\`\``)
          .addField('System', `\`\`\`Uptime: ${ms(client.uptime, { length: 2, language: 'en', long: true }) } \n Platform: ${os.platform()} \nArch: ${os.arch()}  \`\`\``)
          

        return message.channel.createMessage({ embed })
    }

}

export default Comando;
