'reach 0.1';

const fundraiserApi = {
  projectName: Bytes(64),
  projectGoal: UInt,
  contractDuration: UInt,
  put_done: Fun([], Null)
};

const contributorApi = {
  contribution: UInt,
  get_contribute: Fun([], Bool),
  put_address: Fun([Address], Null),
  put_balance: Fun([UInt], Null),
  put_contributed: Fun([Address, UInt, UInt, UInt], Null),
  put_exiting: Fun([], Null),
  put_timeout: Fun([], Null),
  put_projectName: Fun([Bytes(64)], Null),
  put_transferred: Fun([UInt, Address], Null)
};

export const main = Reach.App(() => {
  const F = Participant('Fundraiser', fundraiserApi);
  const C = ParticipantClass('Contributor', contributorApi);
  deploy();

  F.only(() => {
    const p = {
      name: declassify(interact.projectName),
      goal: declassify(interact.projectGoal),
      duration: declassify(interact.contractDuration)
    }
  });

  F.publish(p);
  F.interact.put_done();

  const [inLoop, sum, timeout] = parallelReduce([true, 0, false])
    .invariant(balance() == sum)
    .while(inLoop && balance() < p.goal)
    .case(C, (() => {
      if (declassify(interact.get_contribute())) {
        return { when: true, msg: declassify(interact.contribution) }
      } else {
        return { when: false, msg: 0 }
      }
    }),
      ((contribution) => contribution),
      ((contribution) => {
        const winner = this;
        C.only(() => {
          interact.put_contributed(winner, contribution, balance(), lastConsensusTime());
        });
        return [true, balance(), false];
      })
    )
    .timeout(p.duration, () => {
      Anybody.publish();
      return [false, sum, true];
    });

  if (timeout) {
    C.interact.put_timeout();

    // Need to transfer contributions back to contributors. Don't know how yet. Until then, ...
    const contributions = balance();
    transfer(balance()).to(F);
    C.interact.put_transferred(contributions, F);

  } else {
    const contributions = balance();
    transfer(balance()).to(F);
    C.interact.put_transferred(contributions, F);
  }

  commit();
  C.interact.put_balance(balance());
  C.interact.put_exiting();
  exit();
});
