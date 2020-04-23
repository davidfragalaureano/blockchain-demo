const SHA256 = require('crypto-js/sha256');
const logger = require('./logger.js');

class Block {
    constructor (index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '23/04/2020', 'Genesis block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    getHeight () {
        return this.chain.length;
    }

    isValidBlockchain () {
        for (let i = 0; i < this.chain.length; i++) {
            const prevBlock = this.chain[i-1];
            const currentBlock = this.chain[i];

            if (i === 0) {
                continue;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (prevBlock.hash !== currentBlock.previousHash) {
                return false;
            }
        }

        return true;
    }
}

logger.debug('Creating blockchain...');
let blockchainDemo = new Blockchain();

logger.debug('Adding new blocks...');
blockchainDemo.addBlock(new Block(1, '23/04/2020', { amount: 40 }));
blockchainDemo.addBlock(new Block(2, '23/04/2020', { amount: 10 }));

console.log(JSON.stringify(blockchainDemo,null, 4));

logger.debug('Is blockchain valid? '+  blockchainDemo.isValidBlockchain());

logger.debug('modifying existing blocks...');
blockchainDemo.chain[1].data = { amount: 1000000000 };
blockchainDemo.chain[1].hash = blockchainDemo.chain[1].calculateHash();

logger.debug('Is blockchain valid? '+ blockchainDemo.isValidBlockchain());


