const {expect} = require('chai');
const {ethers} = require('hardhat');

describe("tx.origin attack", function() {
  it("Attack.sol will be able to change the owner of Good.sol", async function() {

    // Get one address
    const[_, addr1] = await ethers.getSigners();

    //Deploy Good Contract

    const Good = await ethers.getContractFactory('Good');
    const goodContract = await Good.connect(addr1).deploy();
    await goodContract.deployed();
    console.log("Good Contract Address: ", goodContract.address); 

    const Attack = await ethers.getContractFactory('Attack');
    const attackContract =await Attack.deploy(goodContract.address);
    await attackContract.deployed();
    console.log("Attack Contract Address: ", attackContract.address); 

    let tx = await attackContract.connect(addr1).attack();
    await tx.wait()

   // Now let's check if the current owner of Good.sol is actually Attack.sol

   expect(await goodContract.owner()).to.equal(attackContract.address);
  });
});

/**
 * 
 * The attack will happen as follows,
 *  
 * 1. initially addr1 will deploy Good.sol and will be the owner 
 *    but the attacker will somehow fool the user who has the private key of addr1 to click on a misleading User Interface
 *    to call the attack function with Attack.sol.
 * 
 * 2.  When the user calls attack function with addr1,
 *    tx.origin is set to addr1
 * 
 * 3. attack function further calls setOwner function of Good.sol 
 *    which first checks if tx.origin is indeed the owner which is true
 *    because the original transaction was indeed called by addr1
 * 
 * 4. After verifying the owner, it sets the owner to Attack.sol
 * 
 * 5. And thus attacker is successfully able to change the owner of Good.sol
 * 
 * PREVENTION 
 * 
 * You should use msg.sender instead of tx.origin to not let this happen. 
 * There is almost never a good use case for tx.origin except in very specific cases - and in those times, be VERY careful.
 * 
 */