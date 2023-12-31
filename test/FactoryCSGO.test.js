const { expect, assert }  = require("chai");
const { ethers }          = require("hardhat");

let contract;
let accounts;
let FactoryContract;
let CSGOChildFactory;
let CSGOChildContract;

// deployment of the factory contract 
beforeEach( async () => {
    accounts                = await ethers.getSigners();
    FactoryContract          = await ethers.getContractFactory("CSGOFactory");
    CSGOChildFactory     = await ethers.getContractFactory("CSGO");
    contract                = await FactoryContract.deploy();
    await contract.deployed();

    await contract.createGame(
        "NAVI vs NIP", "test description", 
        ethers.utils.parseEther("1.0"), 
        [
            ['id01','s1mple', 0,0, true],
            ['id02','b1t', 0, 0,true],
            ['id03','electron1c', 0,0, true],
            ['id04','dev1ce', 0, 0,true],
            ['id05','zywoo', 0, 0,true],
            ['id06','forest', 0, 0,true],
            ['id07','perfecto', 0, 0,true],
            ['id08','niko', 0, 0,true],
        ]
    );

    const addr              = await contract.CSGOGames(0);
    CSGOChildContract    = CSGOChildFactory.attach(addr);
});

describe("CSGO Factory Contract Tests", () => {
    it("Deployment & Owner Check", async () => {
        const owner = await contract.owner();
        expect(owner).to.equal(accounts[0].address);
    });
    
    it("CSGO Child Deployment Check", async () => {
        try {
            await contract.createGame(
                "NAVI vs NIP", "test description", 
                ethers.utils.parseEther("1.0"), 
                [
                ['id01','s1mple', 0,0, true],
                ['id02','b1t', 0, 0,true],
                ['id03','electron1c', 0,0, true],
                ['id04','dev1ce', 0, 0,true],
                ['id05','zywoo', 0, 0,true],
                ['id06','forest', 0, 0,true],
                ['id07','perfecto', 0, 0,true],
                ['id08','niko', 0, 0,true],
                ]
            );
            assert(true);
        } catch (err) {
            assert(false, err);
        }
        
        const name = await CSGOChildContract.name();
        expect(name).to.equal("NAVI vs NIP");
        
    });

    it("StartGame function check in factory format", async () => {
        try {
            await contract.startGame(0);
            assert(true);
        } catch (err) {
            assert(false, err);
        }

        const gameStat = await CSGOChildContract.gameStatus();
        expect(gameStat).to.equal(1);
    });

    it("Getgames function check for factory", async () => {
        await contract.createGame(
            "NAVI vs NIP", "test description", 
                ethers.utils.parseEther("1.0"), 
                [
                ['id01','s1mple', 0,0, true],
                ['id02','b1t', 0, 0,true],
                ['id03','electron1c', 0,0, true],
                ['id04','dev1ce', 0, 0,true],
                ['id05','zywoo', 0, 0,true],
                ['id06','forest', 0, 0,true],
                ['id07','perfecto', 0, 0,true],
                ['id08','niko', 0, 0,true],
                ]
        );
        const data = await contract.getGames();
        expect(data.length).to.equal(2);
    });

    it("Update score function check in factory format", async () => {
        try {
            await contract.startGame(0);
            await contract.updateScore(0, [
                ['id01','s1mple', 20,0, true],
                ['id02','b1t', 10,0, true],
                ['id03','electron1c', 0,0, true],
            ]);
            assert(true);
        } catch (err) {
            assert(false, err);
        }

        const player1 = await CSGOChildContract.players('id01');
        const player2 = await CSGOChildContract.players('id02');
        const player3 = await CSGOChildContract.players('id03');

        expect(player1.kills).to.equal(20);
        expect(player1.deaths).to.equal(0);
        expect(player2.kills).to.equal(10);
        expect(player2.deaths).to.equal(0);
        expect(player3.kills).to.equal(0);
        expect(player3.deaths).to.equal(0);
    });

});