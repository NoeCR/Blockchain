import Block from './block';
import validate from './modules/validate';
import MemoryPool from './memoryPool';

class BlockChain {
  constructor() {
    this.blocks = [Block.genesis];
    this.memoryPool = new MemoryPool();
  }

  addBlock(data) {
    const previousBlock = this.blocks[this.blocks.length - 1];
    const block = Block.mine(previousBlock, data);

    this.blocks.push(block);
    return block;
  }

  replace(newBLocks = []) {
    if (newBLocks.length < this.blocks.length) throw Error('Received chain is not longer than current chain');
    try {
      validate(newBLocks);
    } catch (error) {
      throw Error('Received chain is invalid');
    }

    this.blocks = newBLocks;

    return this.blocks;
  }
}

export default BlockChain;
