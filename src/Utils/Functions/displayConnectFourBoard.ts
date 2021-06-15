import canvas from 'canvas';
const { createCanvas } = canvas;
import imagenesC from '../Interfaces/imagenes.js';
import c4 from 'connect4-ai';
import buffer from './toBuffer.js';
import GIFEncoder from 'gifencoder'
import util from 'util';
const { promisify } = util
interface potonum {
    [x: string]: number
}
interface potoImage {
    [x: string]: canvas.Image
}
async function displayConnectFourBoard(mapa: string[][], game: c4.Connect4AI, imagenes: imagenesC): Promise<Buffer> {
    const toBuffer = promisify(buffer);
    const encoder = new GIFEncoder(700, 600);
    const stream = encoder.createReadStream()
    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.
    mapa = mapa.map(a => a.map(e => e.replace('⬛', '⚪')))
    const win = imagenes.connect4.win
    const bck = imagenes.connect4.background;
    const imgs: potoImage = {
        "🟢": imagenes.connect4.verde,
        "🟡": imagenes.connect4.amarillo
    }
    const canvas = createCanvas(700, 600)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bck, 0, 0, 700, 600)
    const columna: potonum = {
        "0": 10,
        "1": 110,
        "2": 210,
        "3": 310,
        "4": 410,
        "5": 510,
        "6": 610,
    },
        fila: potonum = {
            "0": 10,
            "1": 110,
            "2": 210,
            "3": 310,
            "4": 410,
            "5": 510
        },
        filaR: potonum = {
            "0": 510,
            "1": 410,
            "2": 310,
            "3": 210,
            "4": 110,
            "5": 10
        }

    let numero = 0;
    for (const i of mapa) {
        let lugar = 0;
        for (const j of i) {
            if (imgs[j]) {
                ctx.drawImage(imgs[j], columna[lugar] + 10, fila[numero] + 10, 50, 50)
            } lugar++
        }
        numero++
    }

    encoder.addFrame(ctx)

    if (game.solution) {
        for (const i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (const i of game.solution) {
            ctx.drawImage(game.winner == 1 ? imgs['🟢'] : imgs['🟡'], columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (const i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
    }

    encoder.finish();

    return (toBuffer(stream));

}

export default displayConnectFourBoard;
