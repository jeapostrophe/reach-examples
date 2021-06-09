# Crowdfunding

This DApp enables a Fundraiser to deploy a smart contract that runs for a period of time (e.g. number of blocks) on a consensus network (e.g. Algorand, Ethereum) with a fundraising goal in cryptocurrency standard units (e.g. ALGO, ETH), and it enables Contributers to transfer coins to the contract until the goal is met or the period of time expires. If the goal is met before the contract expires, the contract transfers the contribution sum to the Fundraiser. Otherwise, the contract remits the contributions to the contributors.

# Issues

This DApp runs correctly on Ethereum where each contributer scans the history of contributions (for the contract) before contributing. The DApp does not run correctly on Algorand. Contributors 1 and 2 appear to run correctly. Subsequent contributors don't. See the Tests below.

# Tests

You can test this DApp using several terminals, running each in order:

1. `make run-fundraiser`
1. `make run-contributor`
1. `make run-contributor`
1. `make run-contributor`
1. `make run-contributor`
1. `make run-contributor`

The `*` next to an abbreviated address (e.g. `0x433*`) means the address belongs to the Contributor running the DApp.

## Ethereum

### Fundraiser

```
% make run-fundraiser
Your role is Fundraiser.
Your network type is devnet.
Your account balance is 1000 ETH.
Your project goal is 20 ETH.
Your contract deployment time is 52642
Your contract info is {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
You are done.
```

### Contributor 1

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 1
What is the contract information? {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
0x433* contributed 1 ETH at 52643. Contract balance is 1 ETH.
```

### Contributor 2

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 3
What is the contract information? {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
0x433  contributed 1 ETH at 52643. Contract balance is 1 ETH.
0xe00* contributed 3 ETH at 52645. Contract balance is 4 ETH.
```

### Contributor 3

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 5
What is the contract information? {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
0x433  contributed 1 ETH at 52643. Contract balance is 1 ETH.
0xe00  contributed 3 ETH at 52645. Contract balance is 4 ETH.
0xc7e* contributed 5 ETH at 52875. Contract balance is 9 ETH.
```

### Contributor 4

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 7
What is the contract information? {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
0x433  contributed 1 ETH at 52643. Contract balance is 1 ETH.
0xe00  contributed 3 ETH at 52645. Contract balance is 4 ETH.
0xc7e  contributed 5 ETH at 52875. Contract balance is 9 ETH.
0x934* contributed 7 ETH at 53285. Contract balance is 16 ETH.
```

### Contributor 5

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 9
What is the contract information? {"address":"0x123","creation_block":52642,"transactionHash":"0xabc"}
0x433  contributed 1 ETH at 52643. Contract balance is 1 ETH.
0xe00  contributed 3 ETH at 52645. Contract balance is 4 ETH.
0xc7e  contributed 5 ETH at 52875. Contract balance is 9 ETH.
0x934  contributed 7 ETH at 53285. Contract balance is 16 ETH.
0x4Bd* contributed 9 ETH at 53794. Contract balance is 25 ETH.
Transferred 25 ETH to 0xbBf. Contract balance is 0 ETH.
The contract is exiting.
```

## Algorand

### Fundraiser

```
% make run-fundraiser
Your role is Fundraiser.
Your network type is devnet.
Your account balance is 1000 ALGO.
Your project goal is 20000000 ALGO.
Your contract deployment time is 8393
Your contract info is {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
You are done.
```

### Contributor 1

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 1
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x4cc* contributed 1 ALGO at 8396. Contract balance is 1 ALGO.
```

### Contributor 2

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 3
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x4cc  contributed 1 ALGO at 8396. Contract balance is 1 ALGO.
0x5e3* contributed 3 ALGO at 8407. Contract balance is 4 ALGO.
```

### Contributor 3

This appears to be wrong. Compare to Ethereum Contributor 3.

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x5e3  contributed 3 ALGO at 8396. Contract balance is 3 ALGO.
```

### Contributor 4

This appears to be wrong. Compare to Ethereum Contributor 4.

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 7
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x5e3  contributed 3 ALGO at 8396. Contract balance is 3 ALGO.
```

### Contributor 5

This appears to be wrong. Compare to Ethereum Contributor 5.

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 9
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x5e3  contributed 3 ALGO at 8396. Contract balance is 3 ALGO.
```

# Timeouts

The contract duration is controlled by the `contractDuration` property of the `FundraiserApi` interact object. Below is the output from a Contributor monitoring a contract timeout. Note the line *Contract timed out*.

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ETH.
What is your contribution in ETH? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0xC30  contributed 3 ETH at 55708. Contract balance is 3 ETH.
0x5Fc  contributed 4 ETH at 55712. Contract balance is 7 ETH.
0xcD5* contributed 5 ETH at 55766. Contract balance is 12 ETH.
Contract timed out.
Transferred 12 ETH to 0xF44.
Contract balance is 0 ETH.
The contract is exiting.
```

Eventually, for a timeout, the DApp will remit all contributions to contributors. However, because I don't know how to do this yet, currently the DApp transfers the sub-goal balance to the Fundraiser. 