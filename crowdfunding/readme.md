# Crowdfunding

The use case for this DApp is to enable a fundraiser to raise a specified amount of cryptocurrency (e.g. `fundraisingGoal`) from one or more contributors within a period of time (e.g. `contractDuration`). During `contractDuration`, crypto flows from Contributor accounts to the contract account. Contributors may contribute one or more times. When `fundraisingGoal` is achieved, the contract balance flows from the contract account to the fundraiser account, and the contract exits. When `contractDuration` is reached, all portions of the contract balance flow from the contract account back to the various contributor accounts, and the contract exits. `fundraisingGoal` is measured in standard units. `contractDuration` is usually measured in number of blocks.

# Limitations

1. Does not refund yet.
1. Does not allow multiple contributions from the same contributor yet. 

# Tests

You can test this DApp using multiple terminals. First, run `make run-contributor` in a few terminals, specify the contribution for each contributor, and leave the app waiting for contract information. Next, run `make run-fundraiser` to completion in another terminal. Then, copy & paste the contraction information to the contributor terminals, click enter in each, and let them run to completion. The `*` next to an abbreviated address (e.g. `0x433*`) means the address belongs to the Contributor running in that particular terminal.

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
Your project goal is 20 ALGO.
Your contract deployment time is 15
Your contract info is {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
You are done.
```

### Contributor 1

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x08e* contributed 5 ALGO at 18. Contract balance is 5 ALGO.
```

### Contributor 2

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x08e  contributed 5 ALGO at 18. Contract balance is 5 ALGO.
0x832* contributed 3 ALGO at 21. Contract balance is 8 ALGO.
```

### Contributor 3

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x08e  contributed 5 ALGO at 18. Contract balance is 5 ALGO.
0x832  contributed 3 ALGO at 21. Contract balance is 8 ALGO.
0x031* contributed 4 ALGO at 24. Contract balance is 12 ALGO.
```

### Contributor 4

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO? 5
What is the contract information? {"ApplicationID":46,"creationRound":8393,"Deployer":"ABC"}
0x08e  contributed 5 ALGO at 18. Contract balance is 5 ALGO.
0x832  contributed 3 ALGO at 21. Contract balance is 8 ALGO.
0x031  contributed 4 ALGO at 24. Contract balance is 12 ALGO.
0xb57* contributed 20 ALGO at 27. Contract balance is 32 ALGO.
Transferred 32 ALGO to 0x158.
Contract balance is 0 ALGO.
The contract is exiting.
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

Eventually, for a timeout, the DApp will refund all contributions to contributors. However, because I don't know how to do this yet, currently the DApp transfers the sub-goal balance to the Fundraiser. 
