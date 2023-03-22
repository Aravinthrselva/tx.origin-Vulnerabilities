# tx.origin-Vulnerabilities
tx.origin vulnerability (that resulted in a $8 million hack on Thor chain) (hint : msg.sender)

/**
 * 
 * Attack breakdown
 *  
 * 1. initially addr1 will deploy Good.sol and will be the owner 
 *    but the attacker somehow fools the user who has the private key of addr1 into click on a misleading User Interface
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
 * 5. And thus attacker is successfully able to change the owner of Good.sol.
 * 
 * 6. PREVENTION 
 * 
 * -Use msg.sender instead of tx.origin to not let this happen. 
 * -There is almost never a good use case for tx.origin except in very specific cases - and in those times, be VERY careful.
 * 
 */
