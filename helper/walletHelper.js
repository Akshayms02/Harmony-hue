const userModel = require("../models/userModel");

const walletAmountAdding = async (userId, subTotal) => {
  try {
    // Fetching current user
    const user = await userModel.findById(userId);

    console.log(subTotal)
    // Calculating new balance
    const currentBalance = user.wallet.balance;
    const amount = parseInt(subTotal);
    const newBalance = currentBalance + amount;

    // Creating new detail
    const newDetail = {
      type: "refund",
      amount: amount,
      date: new Date(),
      transactionId: Math.floor(100000 + Math.random() * 900000),
    };

    // Updating user with new balance and new detail
    const response = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { "wallet.balance": newBalance },
        $push: { "wallet.details": newDetail },
      },
      { new: true } // to return the updated document
    );

    return response;
  } catch (error) {
    console.error("Error updating wallet amount:", error);
    throw error;
  }
};

module.exports = {
  walletAmountAdding,
};
