import uuidV4 from 'uuid/v4';
import { elliptic } from '../modules/index';

const REWARD = 1;

class Transaction {
  constructor() {
    this.id = uuidV4();
    this.input = null;
    this.outputs = [];
  }

  static create(senderWallet, recipientAddress, amount) {
    const { balance, publicKey } = senderWallet;

    if (amount > balance) throw Error(`Amount ${amount} exceeds balance.`);

    const transaction = new Transaction();
    transaction.outputs.push(...[
      { amount: balance - amount, address: publicKey },
      { amount, address: recipientAddress },
    ]);

    transaction.input = this.sign(transaction, senderWallet);

    return transaction;
  }

  static verify(transaction) {
    const { input: { address, signature }, outputs } = transaction;

    return elliptic.verifySignature(address, signature, outputs);
  }

  update(senderWallet, recipientAddress, amount) {
    const senderOutput = this.outputs.find(({ address }) => address === senderWallet.publicKey);

    if (amount > senderOutput.amount) throw Error(`Amount ${amount} exceeds balance.`);

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipientAddress });
    this.input = Transaction.sign(this, senderWallet);

    return this;
  }

  static sign(transaction, senderWallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(transaction.outputs),
    };
  }

  static reward(minerWallet, blockchainWallet) {
    return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
  }
}

export { REWARD };
export default Transaction;
