export const stakeAbi = [
    // Get reward for duration
    "function getRewardForDuration() external view returns (uint[])",

    // Get current reward rates
    "function rewardPerToken() external view returns (uint[])",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    // Get current rewards
    "function earned(address account) view returns (uint[])",

    // Get total staked amount
    "function totalSupply() view returns (uint256)",

    // Stake tokens
    "function stake(uint amount) external",

    // Withdraw tokens
    "function withdraw(uint amount) external",

    // Claim reward
    "function getReward() external",

    // Claim and withdraw
    "function exit()"
  ];