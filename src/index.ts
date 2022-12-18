import * as crypto from 'crypto'

class Block {
    public timestamp: Date
    public data: any
    public previousHash: string
    public hash: string

    constructor(data: any, previousHash: string) {
        this.timestamp = new Date()
        this.data = data
        this.previousHash = previousHash;
        this.hash = this.calcHash()
    }

    public calcHash(): string {
        const dataString = JSON.stringify(this.data);
        const hash = crypto.createHash('SHA256')
        hash.update(dataString + this.timestamp + this.previousHash).end()
        return hash.digest('hex')
    }
}

class Blockchain {
    public chain: Block[]
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    public createGenesisBlock(): Block {
        return new Block({ version: '1.0.0', amount: 0 }, "0")
    }

    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1]
    }

    public addBlock(newBlock: Block): void {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calcHash()
        this.chain.push(newBlock)
    }

    public isChainValid(): Boolean {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index]
            const previousBlock = this.chain[index - 1]

            if (currentBlock.hash !== currentBlock.calcHash()) {
                return false
            }

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false
            }
        }
        return true
    }

    public makePayment(amount: number, sender: string, recipient: string): void {
        const newBlock = new Block({ amount, sender, recipient }, this.getLatestBlock().hash)
        this.addBlock(newBlock)
    }
}

class Wallet {
    private balance: number
    private address: string

    constructor(balance: number, address: string) {
        this.balance = balance;
        this.address = address;
    }

    public getBalance(): number {
        return this.balance;
    }

    public getAddress(): string {
        return this.address;
    }

    public recieveFunds(amount: number): void {
        console.log(this.address + " recieved " + amount + " coins.")
        this.balance += amount;
    }

    public sendFunds(recipientAddress: string, amount: number): boolean {
        if (this.balance < amount) {
            console.log("Insufficient balance.")
            return false
        }

        console.log("Sent " + amount + " coins to " + recipientAddress)
        this.balance -= amount
        return true
    }
}

const blockchain = new Blockchain()

blockchain.makePayment(20, "Alice", "Bob")
blockchain.makePayment(7, "Charlie", "John")
blockchain.makePayment(24, "Bob", "John")

console.log(blockchain.chain)
console.log("Blockchain valid?", blockchain.isChainValid())

const wallet = new Wallet(50, '0x41e8k93i1012');
console.log("Balance: " + wallet.getBalance());
console.log("Address: " + wallet.getAddress());
wallet.recieveFunds(100);
console.log("Balance: " + wallet.getBalance()); // 150
wallet.sendFunds('456def', 75); // true
console.log("Balance: " + wallet.getBalance()); // 75
wallet.sendFunds('456def', 100); // false
console.log("Balance: " + wallet.getBalance()); // 75
