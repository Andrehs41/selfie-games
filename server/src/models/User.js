import mongoose from 'mongoose';

const { Schema } = mongoose;

// Resultado de la trivia (se llena una sola vez por usuario).
const triviaResultSchema = new Schema(
  {
    played: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    playedAt: { type: Date },
  },
  { _id: false }
);

// Resultado de la ruleta (se llena una sola vez por usuario).
const ruletaResultSchema = new Schema(
  {
    played: { type: Boolean, default: false },
    prizeIndex: { type: Number },
    prizeLabel: { type: String },
    prizeType: { type: String, enum: ['win', 'retry'] },
    playedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefono: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    games: {
      trivia: { type: triviaResultSchema, default: () => ({}) },
      ruleta: { type: ruletaResultSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Lo que se expone al cliente (nunca el hash).
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    email: this.email,
    telefono: this.telefono,
    role: this.role,
    games: this.games,
  };
};

export const User = mongoose.model('User', userSchema);
