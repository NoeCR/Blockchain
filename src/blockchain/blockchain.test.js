import BlockChain from './blockchain';
import Block from './block';

describe('BlockChain', () => {
  let blockChain;
  let alterBlockChain;

  beforeEach(() => {
    blockChain = new BlockChain();
    alterBlockChain = new BlockChain();
  });

  it('every blockchain has a genesis block', () => {
    const [genesisBlock] = blockChain.blocks;

    expect(genesisBlock).toEqual(Block.genesis);
    expect(blockChain.blocks.length).toEqual(1);
  });

  it('use addBlock()', () => {
    const data = 'd4t4';
    blockChain.addBlock(data);

    const [, lastBlock] = blockChain.blocks;
    expect(lastBlock.data).toEqual('d4t4');
    expect(blockChain.blocks.length).toEqual(2);
  });

  it('replaces the chain with a valid chain', () => {
    alterBlockChain.addBlock('b14ck-1');

    blockChain.replace(alterBlockChain.blocks);

    expect(blockChain.blocks).toEqual(alterBlockChain.blocks);
  });

  it('does not replace chan with one with less blocks', () => {
    alterBlockChain.addBlock('b14ck-1');

    expect(() => {
      alterBlockChain.replace(blockChain.blocks);
    }).toThrowError('Received chain is not longer than current chain');
  });

  it('not replace the chain with one is not valid', () => {
    alterBlockChain.addBlock('b14ck-1');
    alterBlockChain.blocks[1].data = 'h4ck';

    expect(() => {
      blockChain.replace(alterBlockChain.blocks);
    }).toThrowError('Received chain is invalid');
  });
});
