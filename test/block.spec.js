/**
 *  Author: Tom Hill <tp.hill.uk@gmail.com>
 *  Created: Wed 26 Sep 2018
 */

const SHA3 = require('crypto-js/sha3');
const {
    expect
} = require('chai');

const Block = require('../block.js');

describe('The Block class', function () {
    describe('The Genesis Block', function () {
        const genesis = Block.genesis();

        it('Should return expected data', function () {
            const timestamp = 'Genesis Timestamp';
            const lastHash = SHA3('No previous hash');
            const hash = Block.generateHash(timestamp, lastHash, []);

            expect(genesis.getTimestamp()).to.equal(timestamp);
            expect(genesis.getLastHash()).to.deep.equal(lastHash);
            expect(genesis.getHash()).to.deep.equal(hash);
            expect(genesis.getData()).to.deep.equal([]);
        });

        it('Should always have the same values', function () {
            // Unary + triggers a valueOf() on the new Date() instance
            const newGenesis = new Block(+new Date(), 'l45t-h45h', 'n3w-h45h', []).getGenesis();

            expect(newGenesis.getTimestamp()).to.equal(genesis.getTimestamp());
            expect(newGenesis.getLastHash()).to.deep.equal(genesis.getLastHash());
            expect(newGenesis.getHash()).to.deep.equal(genesis.getHash());
            expect(newGenesis.getData()).to.deep.equal(genesis.getData());
            expect(newGenesis.toString()).to.equal(genesis.toString());
        });
    });

    describe('A New Instance', function () {
        const timestamp = +new Date();
        const lastHash = SHA3('0123456789876543210');
        const data = JSON.stringify({
            data: 'some data'
        });
        const hash = Block.generateHash(timestamp, lastHash, data);

        const block = new Block(timestamp, lastHash, hash, data);

        it('Returns the correct data from its getters', function () {
            expect(block.getTimestamp()).to.equal(timestamp);
            expect(block.getLastHash()).to.equal(lastHash);
            expect(block.getHash()).to.equal(hash);
            expect(block.getData()).to.equal(data);
        });

        it('Can describe itself with a toString() method', function () {
            expect(block.toString()).to.equal(`Block -
            Timestamp: ${timestamp}
            Last Hash: ${lastHash.toString()}
            Hash     : ${hash.toString()}
            Data     : ${data}`);
        });
    });

    it('Can mine new blocks', function () {
        const data = ['some-data'];
        const block = Block.mineBlock(Block.genesis(), data);

        expect(block).to.be.instanceOf(Block);
        expect(block.getData()).to.deep.equal(data);
        expect(block.getLastHash()).to.deep.equal(Block.genesis().getHash());
    });
});