# Crowdfunding

This Reach DApp is not finished yet. Here is the use case:

1. Fundraiser provides a fundraising goal (e.g. 10 Algo) and a duration in blocks representing how long the contract is valid.
1. Fundraiser deploys the contract. 
1. Contributors contribute varying amounts toward the goal until `sum >= goal` or `blocks added > duration`.

# Tests

I test this DApp using four terminals, running each in order:

1. `make run-fundraiser`
1. `make run-contributor`
1. `make run-contributor`
1. `make run-contributor`

## Fundraiser

```
% make run-fundraiser
Your role is Fundraiser.
Your network type is devnet.
Your account balance is 1000 ALGO.
Your project goal is 10 ALGO.
You are deploying the contract.
Your contract info is {"ApplicationID":2,"creationRound":8,"Deployer":"W2YDQLYAEXR6THWL6Q2QLLSSK3FJYG336NWIXYKTFH4XPB3UBPDFSRIWLI"}
Fundraiser, you are done.
```

## Contributor 1

```
 % make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO?
1
What is the contract information?
{"ApplicationID":2,"creationRound":8,"Deployer":"W2YDQLYAEXR6THWL6Q2QLLSSK3FJYG336NWIXYKTFH4XPB3UBPDFSRIWLI"}
Your address starts with 0x199.
0x199 (YOU) contributed 1 ALGO to contract.
0x199 (YOU) reported contract balance of 1 ALGO.
```

## Contributor 2

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO?
2
What is the contract information?
{"ApplicationID":2,"creationRound":8,"Deployer":"W2YDQLYAEXR6THWL6Q2QLLSSK3FJYG336NWIXYKTFH4XPB3UBPDFSRIWLI"}
Your address starts with 0xef4.
0x199 contributed 1 ALGO to contract.
0x199 reported contract balance of 1 ALGO.
0xef4 (YOU) contributed 2 ALGO to contract.
0xef4 (YOU) reported contract balance of 3 ALGO.
```

## Contributor 3

```
% make run-contributor
Your role is Contributor.
Your network type is devnet.
Your account balance is 1000 ALGO.
What is your contribution in ALGO?
3
What is the contract information?
{"ApplicationID":2,"creationRound":8,"Deployer":"W2YDQLYAEXR6THWL6Q2QLLSSK3FJYG336NWIXYKTFH4XPB3UBPDFSRIWLI"}
Your address starts with 0x0ef.
0xef4 contributed 2 ALGO to contract.
0xef4 reported contract balance of 2 ALGO.
```

# Observations

1. Fundraiser, Contributor 1, and Contributor 2 run as expected.
1. Contributor 3 does not go back to the beginning. It only goes back to the previous contributor.
1. Contributor 3 never contributes. 