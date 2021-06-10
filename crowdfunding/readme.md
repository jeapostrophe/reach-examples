# Crowdfunding

The use case for this DApp is to enable a fundraiser to raise a specified amount of cryptocurrency (e.g. `fundraisingGoal`) from one or more contributors within a period of time (e.g. `contractDuration`). During `contractDuration`, crypto flows from Contributor accounts to the contract account. Contributors may contribute one or more times. When `fundraisingGoal` is achieved, the contract balance flows from the contract account to the fundraiser account, and the contract exits. When `contractDuration` is reached, all portions of the contract balance flow from the contract account back to the various contributor accounts, and the contract exits. `fundraisingGoal` is measured in standard units. `contractDuration` is usually measured in number of blocks.

# Current Limitations

This section describes the various ways that the current implementation fails to meet the use case described above. 

### Does not refund

The current implementation does not yet refund the various contributions to the contributors when `contractDuration` is reached. Potential approaches perhaps include the following:

1. When `parallelReduce` times out, loop over payment history, and refund each payment. Does Reach allow this?
1. Use a `Map` to track contribution totals per contributor address, and, when `parallelReduce` times out, loop over the `Map` and refund. Does Reach allow this? Can this approach handle 20,000 contributions? 

    ```
    const myFromMaybe = (m) => fromMaybe(m, (() => 0), ((x) => x));
    const ctMap = new Map(UInt);
    const [...] = parallelReduce([...])
    .invariant(...)
    .while(...)
    .case(C, (() => {...}),
      ((contribution) => contribution),
      ((contribution) => {
        const winner = this;
        ctMap[winner] = myFromMaybe(ctMap[winner]) + contribution;
        ...
        return [...];
      })
    )
    .timeout(p.duration, () => {
      Anybody.publish();
      return [...];
    });

    if (timeout) {
      ctMap.forEach((amt, addr) => transfer(amt).to(addr)); // I made this up.
    }
    ```

### Does not allow multiple contributions from the same contributor

The current implementation does not yet allow a contributor to contribute more than once. Right now it is binary: If you haven't contributed, contribute. If you have contributed, don't. See `contributorApi.reportContributed` in [index.mjs](index.mjs). 

### Does not start from now

The current implementation does not yet allow a contributor to contribute without reviewing all previous contributions. I question whether this is scalable. The contributor making Contribution #4000, for example, needs to review 3999 contributions before paying a new contribution. See Ethereum > [Contributor 5](#contributor-5) below.

### Does not run correctly on Algorand

The `parallelReduce` operator does not run correctly on Algorand. See Test > [Algorand](#algorand) below.

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

Eventually, for a timeout, the DApp will refund all contributions to contributors. However, because I don't know how to do this yet, currently the DApp transfers the sub-goal balance to the Fundraiser. 