import mongoose from 'mongoose';

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

const budgetId = '671547f57b99932dbd926923';
console.log("Is valid ObjectId:", isValidObjectId(budgetId));