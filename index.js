import PKG from './package.json';
import Block from './src/blockchain/block';

const { name, version } = PKG;
console.log(`${name} v${version}`);

const { genesis } = Block;

const blockOne = Block.mine(genesis, 'd4t4-1');
console.log(blockOne.toString());

const blockTwo = Block.mine(blockOne, 'd4t4-2');
console.log(blockTwo.toString());