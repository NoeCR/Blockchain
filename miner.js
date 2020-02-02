import BlockChain from './src/blockchain';

const blockChain = new BlockChain();

for (let i = 0; i < 10; i++) {
  const block = blockChain.addBlock(`block-${i + 1}`);

  console.log(block.toString());
}