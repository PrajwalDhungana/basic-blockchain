"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
class Block {
    constructor(data, previousHash) {
        this.timestamp = new Date();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calcHash();
    }
    calcHash() {
        const dataString = JSON.stringify(this.data);
        const hash = crypto.createHash('SHA256');
        hash.update(dataString + this.timestamp + this.previousHash).end();
        return hash.digest('hex');
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block({ version: '1.0.0', amount: 0 }, "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calcHash();
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];
            if (currentBlock.hash !== currentBlock.calcHash()) {
                return false;
            }
            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    }
    makePayment(amount, sender, recipient) {
        const newBlock = new Block({ amount, sender, recipient }, this.getLatestBlock().hash);
        this.addBlock(newBlock);
    }
}
class Wallet {
    constructor(balance, address) {
        this.balance = balance;
        this.address = address;
    }
    getBalance() {
        return this.balance;
    }
    getAddress() {
        return this.address;
    }
    recieveFunds(amount) {
        console.log(this.address + " recieved " + amount + " coins.");
        this.balance += amount;
    }
    sendFunds(recipientAddress, amount) {
        if (this.balance < amount) {
            console.log("Insufficient balance.");
            return false;
        }
        console.log("Sent " + amount + " coins to " + recipientAddress);
        this.balance -= amount;
        return true;
    }
}
const blockchain = new Blockchain();
blockchain.makePayment(20, "Alice", "Bob");
blockchain.makePayment(7, "Charlie", "John");
blockchain.makePayment(24, "Bob", "John");
console.log(blockchain.chain);
console.log("Blockchain valid?", blockchain.isChainValid());
const wallet = new Wallet(50, '0x41e8k93i1012');
console.log("Balance: " + wallet.getBalance());
console.log("Address: " + wallet.getAddress());
wallet.recieveFunds(100);
console.log("Balance: " + wallet.getBalance()); // 150
wallet.sendFunds('456def', 75); // true
console.log("Balance: " + wallet.getBalance()); // 75
wallet.sendFunds('456def', 100); // false
console.log("Balance: " + wallet.getBalance()); // 75
