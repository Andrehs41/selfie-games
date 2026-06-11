const mongoose = require('mongoose');

const { Schema } = mongoose;

const triviaResultSchema = new Schema(
  {
    played: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    prizeLabel: { type: String },
    prizeType: { type: String, enum: ['win', 'retry'] },
    playedAt: { type: Date },
  },
  { _id: false }
);

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

// Participante de la activación (kiosko del stand): solo nombre + teléfono.
const participantSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    games: {
      trivia: { type: triviaResultSchema, default: () => ({}) },
      ruleta: { type: ruletaResultSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

participantSchema.methods.toPublic = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    telefono: this.telefono,
    games: this.games,
  };
};

const Participant = mongoose.model('Participant', participantSchema);

module.exports = { Participant };
