# Crowdfunding

This Reach DApp is not finished yet because I have not been able to use Reach to support the following use case:

1. Fundraiser provides a fundraising goal (e.g. 10 Algo) and a duration in blocks representing how long the contract is valid.
1. Fundraiser deploys the contract.
1. Contributors pay contributions (e.g. 2 Algo) toward the goal. 
1. Each contributor pays a contribution, and then stops watching the contract. 
1. Contribution amounts can vary with each visit (same or different contributor). 

You can run this Reach DApp in a single terminal:

1. `make run-fundraiser`
1. `make run-contributor`

## Fundraiser

On `devnet`, the `make run-fundraiser` command does not accept any input. Here is a sample run:

```
Role:     Fundraiser
Type:     devnet
Info:     Getting account ...
Info:     Getting account balance ...
Balance:  1000
Goal:     10
Info:     Deploying contract ...
Contract: {"ApplicationID":41,"creationRound":192,"Deployer":"N3SAKLIMCPVEEPTERUB2U7ESDOSKDZQGEGI75S4PHXOEHZ6WKXSSWSY6QM"}
Interact: The backend said, "Fundraiser, you are done."
```

## Contributor

On `devnet`, the `make run-contributor` command accepts the following input:

```
Role:     Contributor
Type:     devnet
Info:     Getting account ...
Info:     Getting account balance ...
Balance:  1000
Question: What is your contribution in ALGO?
2
Question: What is the contract information?
{"ApplicationID":41,"creationRound":192,"Deployer":"N3SAKLIMCPVEEPTERUB2U7ESDOSKDZQGEGI75S4PHXOEHZ6WKXSSWSY6QM"}
```

A single run might look like this:

```
Interact: 0x56b is the start of your address.
Interact: 0x56b messsage: PUBLISH_EXPR
Interact: 0x56b paid 2 ALGO to contract.
Interact: 0x56b reports contract balance: 2.
Interact: 0x56b messsage: PUBLISH_EXPR
```

At this point, the user should Ctrl-C, and then run `make run-contributor` as either the same contributor or a different one.

## Request

Can you modify this DApp to meet the use case?