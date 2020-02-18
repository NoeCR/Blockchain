import { elliptic, genHash } from '../modules/index';
import Transaction from './transaction';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain) {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  toString() {
    const { balance, publicKey } = this;

    return `Wallet - 
      publicKey   : ${publicKey.toString()}
      balance     : ${balance}`;
  }

  sign(data) {
    return this.keyPair.sign(genHash(data));
  }

  createTransaction(recipientAddress, amount) {
    const { balance, blockchain: { memoryPool } } = this;

    if (amount > balance) throw Error(`Amount: ${amount} exceds current balance: ${balance}`);

    let tx = memoryPool.find(this.publicKey);
    if (tx) tx.update(this, recipientAddress, amount);
    else tx = Transaction.create(this, recipientAddress, amount);

    memoryPool.addOrUpdate(tx);

    return tx;
  }
}
export { INITIAL_BALANCE };
export default Wallet;
