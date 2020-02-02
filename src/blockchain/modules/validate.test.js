import { SHA256 } from 'crypto-js';
import BlockChain from '../blockchain';
import validate from './validate';

describe('Validate', () => {
  let blockChain;

  beforeEach(() => {
    blockChain = new BlockChain();
  });

  it('validates a valid chain', () => {
    blockChain.addBlock('b14ck-1');
    blockChain.addBlock('b14ck-2');

    expect(validate(blockChain.blocks)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    blockChain.blocks[0].data = 'b4d d4t4';

    expect(() => {
      validate(blockChain.blocks);
    }).toThrowError('Invalid Genesis block.');
  });

  it('invalidates chain with a corrupt previousHash within a block', () => {
    blockChain.addBlock('b14ck-1');
    blockChain.blocks[1].previousHash = 'h4ck';

    expect(() => {
      validate(blockChain.blocks);
    }).toThrowError('Invalid previous hash.');
  });

  it('use addBlock()', () => {
    blockChain.addBlock('b14ck-1');
    blockChain.blocks[1].hash = SHA256(`${
      blockChain.blocks[1].timestamp
    }${blockChain.blocks[1].previousHash}h4ck`).toString();

    expect(() => {
      validate(blockChain.blocks);
    }).toThrowError('Invalid hash.');
  });
});
