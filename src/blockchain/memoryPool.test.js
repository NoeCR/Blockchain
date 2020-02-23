import MemoryPool from './memoryPool';

import Wallet, { Transaction } from '../wallet';

describe('MemoryPool', () => {
  let memoryPool;
  let wallet;
  let transaction;

  beforeEach(() => {
    memoryPool = new MemoryPool();
    wallet = new Wallet();
    transaction = Transaction.create(wallet, 'r4nd0m-4ddr33s', 5);
    memoryPool.addOrUpdate(transaction);
  });

  it('has one transaction', () => {
    expect(memoryPool.transactions.length).toEqual(1);
  });

  it('add a transaction to the memoryPool', () => {
    const found = memoryPool.transactions.find(({ id }) => id === transaction.id);
    expect(found).toEqual(transaction);
  });

  it('updates a transaction to the memoryPool', () => {
    const txOld = JSON.stringify(transaction);
    const txNew = transaction.update(wallet, '0th3r-4ddr333ss', 10);

    memoryPool.addOrUpdate(txNew);

    expect(memoryPool.transactions.length).toEqual(1);
    const found = memoryPool.transactions.find(({ id }) => id === transaction.id);
    expect(found).not.toEqual(JSON.parse(txOld));
    expect(found).toEqual(txNew);
  });

  it('wipes transactions', () => {
    memoryPool.wipe();
    expect(memoryPool.transactions.length).toEqual(0);
  })
});
