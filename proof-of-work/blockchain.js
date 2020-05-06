const SHA256 = require('crypto-js/sha256');
const logger = require('./logger.js');

class Block {

    NONCE_COEFFICIENT  = 100000;

    constructor (index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = this.calculateNonce();
    }

    calculateNonce() {
        return Math.floor(Math.random() * this.NONCE_COEFFICIENT);
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    

    mineBlock(difficulty) {

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce = this.calculateNonce();
            this.hash = this.calculateHash();
        }

        logger.info(`Block mined: ${this.hash}`);
    }   
}


class Blockchain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), 'Genesis block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
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
blockchainDemo.addBlock(new Block(1, Date.now(), { amount: 40 }));
blockchainDemo.addBlock(new Block(2, Date.now(), { amount: 10 }));

console.log(JSON.stringify(blockchainDemo,null, 4));

logger.debug('Is blockchain valid? '+  blockchainDemo.isValidBlockchain());



