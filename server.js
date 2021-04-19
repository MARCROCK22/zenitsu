require('dotenv').config();
const { ShardingManager } = require('discord.js-light');

const sharder = new ShardingManager('./index.js', {
    token: process.env.BOT_TOKEN,
    shards: "auto",
    execArgv: ['--expose-gc', '--optimize_for_size', '--max_old_space_size=150']
});

sharder.spawn();
/*
shardError shardResume shardReady shardReconnecting shardDisconnect
*/

sharder
    .on("shardCreate", shardd => {
        console.log(`La shard ${shardd.id} fue creada.`)
        shardd.on('shardDisconnect', shard => console.log(`La shard ${shard.id} se desconecto.`))
            .on('shardResume', shard => console.log(`Shard ${shard.id} resumida.`))
            .on('shardReady', shard => console.log(`La shard ${shard.id} esta lista.`))
    })