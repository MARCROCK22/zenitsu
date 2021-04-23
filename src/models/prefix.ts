import { Schema, model, Document } from 'mongoose';

interface Prefix extends Document {
    id: string;
    prefix: 'z!' | string
}

const Prefix = new Schema({
    id: String,
    prefix: {
        default: 'z!',
        type: String
    },
})

export default model<Prefix>('Prefix', Prefix);