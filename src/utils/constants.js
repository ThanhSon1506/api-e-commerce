const mongoose = require('mongoose')

export function generateRandomObjectId() {
  return mongoose.Types.ObjectId()
}