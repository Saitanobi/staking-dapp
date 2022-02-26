export const tokenAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    // Get account allowance
    "function allowance(address owner, address spender) view returns (uint)",

    // Approve token transfer
    "function approve(address spender, uint amount)",
  
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",

    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];