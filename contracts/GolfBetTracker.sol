// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GolfBetTracker is Ownable {
    IERC20 public usdcToken;
    
    // Fee settings
    uint256 public baseFeePercentage = 300; // 3.00% (scaled by 100)
    uint256 public premiumFeePercentage = 150; // 1.50% (scaled by 100)
    uint256 public proFeePercentage = 0; // 0.00% (scaled by 100)
    address public feeCollector;
    
    // Subscription tiers
    enum SubscriptionTier { FREE, PREMIUM, PRO }
    
    // Mapping to store user subscription tiers
    mapping(address => SubscriptionTier) public userSubscriptions;
    
    // User stats tracking
    struct UserStats {
        uint256 totalBets;
        uint256 wonBets;
        uint256 lostBets;
        uint256 totalWagered;
        uint256 totalWon;
    }
    
    mapping(address => UserStats) public userStats;
    
    // Bet structure
    struct Bet {
        string betType;
        uint256 amount;
        address[] players;
        bool[] joinedStatus;
        mapping(address => bool) votes;
        address[] votedWinners;
        bool settled;
        address winner;
        uint256 createdAt;
    }
    
    // Bet storage
    mapping(bytes32 => Bet) public bets;
    bytes32[] public betIds;
    
    // User bet tracking
    mapping(address => bytes32[]) public userBets;
    
    // Events
    event BetCreated(bytes32 indexed betId, string betType, uint256 amount, address creator);
    event PlayerJoined(bytes32 indexed betId, address player);
    event BetSettled(bytes32 indexed betId, address winner, uint256 amount);
    event FeeCollected(bytes32 indexed betId, uint256 feeAmount);
    event VoteSubmitted(bytes32 indexed betId, address voter, address votedFor);
    event SubscriptionUpdated(address user, SubscriptionTier tier);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        feeCollector = owner();
    }
    
    // External functions
    
    // Update a user's subscription tier (only callable by owner or authorized admin)
    function updateSubscription(address user, SubscriptionTier tier) external onlyOwner {
        userSubscriptions[user] = tier;
        emit SubscriptionUpdated(user, tier);
    }
    
    // Update fee settings
    function updateFeeSettings(
        uint256 _baseFeePercentage, 
        uint256 _premiumFeePercentage, 
        uint256 _proFeePercentage,
        address _feeCollector
    ) external onlyOwner {
        baseFeePercentage = _baseFeePercentage;
        premiumFeePercentage = _premiumFeePercentage;
        proFeePercentage = _proFeePercentage;
        feeCollector = _feeCollector;
    }
    
    // Create a new bet
    function createBet(string calldata betType, uint256 amount, address[] calldata players) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Generate bet ID
        bytes32 betId = keccak256(abi.encodePacked(betType, amount, block.timestamp, msg.sender));
        
        // Initialize bet struct
        Bet storage newBet = bets[betId];
        newBet.betType = betType;
        newBet.amount = amount;
        newBet.players = players;
        newBet.joinedStatus = new bool[](players.length);
        newBet.settled = false;
        newBet.createdAt = block.timestamp;
        
        // Add creator to player list if not already included
        bool creatorIncluded = false;
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                creatorIncluded = true;
                newBet.joinedStatus[i] = true; // Creator automatically joins
                break;
            }
        }
        
        if (!creatorIncluded) {
            // Add creator to players array
            address[] storage betPlayers = newBet.players;
            betPlayers.push(msg.sender);
            newBet.joinedStatus.push(true); // Creator automatically joins
        }
        
        // Store bet ID
        betIds.push(betId);
        
        // Add to user's bets
        userBets[msg.sender].push(betId);
        
        // Update user stats
        userStats[msg.sender].totalBets += 1;
        userStats[msg.sender].totalWagered += amount;
        
        emit BetCreated(betId, betType, amount, msg.sender);
        
        return betId;
    }
    
    // Join a bet
    function joinBet(bytes32 betId) external {
        Bet storage bet = bets[betId];
        require(!bet.settled, "Bet already settled");
        
        // Find player in the list
        bool foundPlayer = false;
        uint256 playerIndex;
        
        for (uint256 i = 0; i < bet.players.length; i++) {
            if (bet.players[i] == msg.sender) {
                foundPlayer = true;
                playerIndex = i;
                break;
            }
        }
        
        require(foundPlayer, "Player not invited to this bet");
        require(!bet.joinedStatus[playerIndex], "Player already joined");
        
        // Transfer USDC tokens to contract
        require(usdcToken.transferFrom(msg.sender, address(this), bet.amount), "Failed to transfer USDC");
        
        // Mark player as joined
        bet.joinedStatus[playerIndex] = true;
        
        // Add to user's bets if not already tracked
        bool alreadyTracked = false;
        for (uint256 i = 0; i < userBets[msg.sender].length; i++) {
            if (userBets[msg.sender][i] == betId) {
                alreadyTracked = true;
                break;
            }
        }
        
        if (!alreadyTracked) {
            userBets[msg.sender].push(betId);
        }
        
        // Update user stats
        userStats[msg.sender].totalBets += 1;
        userStats[msg.sender].totalWagered += bet.amount;
        
        emit PlayerJoined(betId, msg.sender);
    }
    
    // Vote for a winner
    function voteForWinner(bytes32 betId, address winner) external {
        Bet storage bet = bets[betId];
        require(!bet.settled, "Bet already settled");
        
        // Check if sender is a joined player
        bool isJoinedPlayer = false;
        for (uint256 i = 0; i < bet.players.length; i++) {
            if (bet.players[i] == msg.sender && bet.joinedStatus[i]) {
                isJoinedPlayer = true;
                break;
            }
        }
        require(isJoinedPlayer, "Only joined players can vote");
        
        // Check if winner is a joined player
        bool winnerIsJoinedPlayer = false;
        for (uint256 i = 0; i < bet.players.length; i++) {
            if (bet.players[i] == winner && bet.joinedStatus[i]) {
                winnerIsJoinedPlayer = true;
                break;
            }
        }
        require(winnerIsJoinedPlayer, "Voted winner must be a joined player");
        
        // Record vote
        bet.votes[msg.sender] = true;
        bet.votedWinners.push(winner);
        
        emit VoteSubmitted(betId, msg.sender, winner);
        
        // Check if we have consensus
        if (checkConsensus(betId)) {
            settleBet(betId);
        }
    }
    
    // Internal functions
    
    // Check if we have a consensus on the winner
    function checkConsensus(bytes32 betId) internal view returns (bool) {
        Bet storage bet = bets[betId];
        
        // Count joined players
        uint256 joinedPlayerCount = 0;
        for (uint256 i = 0; i < bet.joinedStatus.length; i++) {
            if (bet.joinedStatus[i]) {
                joinedPlayerCount++;
            }
        }
        
        // If no one joined, no consensus
        if (joinedPlayerCount == 0) {
            return false;
        }
        
        // Count votes for each player
        uint256[] memory votes = new uint256[](bet.players.length);
        
        // Tally the votes
        for (uint256 i = 0; i < bet.votedWinners.length; i++) {
            address votedWinner = bet.votedWinners[i];
            for (uint256 j = 0; j < bet.players.length; j++) {
                if (bet.players[j] == votedWinner) {
                    votes[j]++;
                    break;
                }
            }
        }
        
        // Check if any player has more than 50% of votes
        for (uint256 i = 0; i < bet.players.length; i++) {
            if (votes[i] > joinedPlayerCount / 2) {
                return true;
            }
        }
        
        return false;
    }
    
    // Calculate the fee amount based on user's subscription tier
    function calculateFee(uint256 amount, address user) internal view returns (uint256) {
        SubscriptionTier tier = userSubscriptions[user];
        
        if (tier == SubscriptionTier.PRO) {
            return (amount * proFeePercentage) / 10000;
        } else if (tier == SubscriptionTier.PREMIUM) {
            return (amount * premiumFeePercentage) / 10000;
        } else {
            return (amount * baseFeePercentage) / 10000;
        }
    }
    
    // Settle the bet
    function settleBet(bytes32 betId) internal {
        Bet storage bet = bets[betId];
        require(!bet.settled, "Bet already settled");
        
        // Determine the winner by consensus
        address winner;
        uint256 highestVotes = 0;
        
        // Count votes for each player
        for (uint256 i = 0; i < bet.players.length; i++) {
            address player = bet.players[i];
            uint256 voteCount = 0;
            
            for (uint256 j = 0; j < bet.votedWinners.length; j++) {
                if (bet.votedWinners[j] == player) {
                    voteCount++;
                }
            }
            
            if (voteCount > highestVotes) {
                highestVotes = voteCount;
                winner = player;
            }
        }
        
        require(winner != address(0), "No clear winner");
        
        // Count joined players to calculate total pot
        uint256 joinedPlayerCount = 0;
        for (uint256 i = 0; i < bet.joinedStatus.length; i++) {
            if (bet.joinedStatus[i]) {
                joinedPlayerCount++;
            }
        }
        
        // Calculate total pot and fee
        uint256 totalPot = bet.amount * joinedPlayerCount;
        uint256 feeAmount = calculateFee(totalPot, winner);
        uint256 winnerAmount = totalPot - feeAmount;
        
        // Transfer winnings
        if (feeAmount > 0) {
            require(usdcToken.transfer(feeCollector, feeAmount), "Fee transfer failed");
            emit FeeCollected(betId, feeAmount);
        }
        
        require(usdcToken.transfer(winner, winnerAmount), "Winner transfer failed");
        
        // Update bet status
        bet.settled = true;
        bet.winner = winner;
        
        // Update user stats
        userStats[winner].wonBets += 1;
        userStats[winner].totalWon += winnerAmount;
        
        for (uint256 i = 0; i < bet.players.length; i++) {
            if (bet.players[i] != winner && bet.joinedStatus[i]) {
                userStats[bet.players[i]].lostBets += 1;
            }
        }
        
        emit BetSettled(betId, winner, winnerAmount);
    }
    
    // View functions
    
    // Get all bet IDs
    function getAllBetIds() external view returns (bytes32[] memory) {
        return betIds;
    }
    
    // Get a user's bets
    function getUserBets(address user) external view returns (bytes32[] memory) {
        return userBets[user];
    }
    
    // Get detailed bet info
    function getBetDetails(bytes32 betId) external view returns (
        string memory betType,
        uint256 amount,
        address[] memory players,
        bool[] memory joinedStatus,
        bool settled,
        address winner,
        uint256 createdAt
    ) {
        Bet storage bet = bets[betId];
        return (
            bet.betType,
            bet.amount,
            bet.players,
            bet.joinedStatus,
            bet.settled,
            bet.winner,
            bet.createdAt
        );
    }
    
    // Get user statistics
    function getUserStatistics(address user) external view returns (
        uint256 totalBets,
        uint256 wonBets,
        uint256 lostBets,
        uint256 totalWagered,
        uint256 totalWon
    ) {
        UserStats storage stats = userStats[user];
        return (
            stats.totalBets,
            stats.wonBets,
            stats.lostBets,
            stats.totalWagered,
            stats.totalWon
        );
    }
    
    // Get transaction fee for a user
    function getTransactionFee(address user) external view returns (uint256) {
        SubscriptionTier tier = userSubscriptions[user];
        
        if (tier == SubscriptionTier.PRO) {
            return proFeePercentage;
        } else if (tier == SubscriptionTier.PREMIUM) {
            return premiumFeePercentage;
        } else {
            return baseFeePercentage;
        }
    }
    
    // Get user subscription tier
    function getUserSubscriptionTier(address user) external view returns (SubscriptionTier) {
        return userSubscriptions[user];
    }
} 