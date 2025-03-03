// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GolfBetTracker is Ownable {
    struct Bet {
        string betType;
        uint256 amount;
        string[] players;
        mapping(string => bool) results;
        uint256 timestamp;
        bool settled;
    }

    mapping(bytes32 => Bet) public bets;
    mapping(address => uint256) public userBetCount;
    uint256 public constant FREE_TIER_LIMIT = 3;

    event BetCreated(
        bytes32 indexed betId,
        string betType,
        uint256 amount,
        string[] players,
        uint256 timestamp
    );

    event BetSettled(bytes32 indexed betId, string[] winners);

    constructor() Ownable(msg.sender) {}

    function createBet(
        string memory _betType,
        uint256 _amount,
        string[] memory _players
    ) external returns (bytes32) {
        require(_players.length >= 2, "Minimum 2 players required");
        require(bytes(_betType).length > 0, "Bet type required");
        
        // Check free tier limit
        if (!isPremiumUser(msg.sender)) {
            require(
                userBetCount[msg.sender] < FREE_TIER_LIMIT,
                "Free tier limit reached"
            );
        }

        // Create a unique bet ID using keccak256
        bytes32 betId = keccak256(
            abi.encode(
                msg.sender,
                block.timestamp,
                _betType,
                _amount,
                keccak256(abi.encode(_players))
            )
        );

        Bet storage newBet = bets[betId];
        newBet.betType = _betType;
        newBet.amount = _amount;
        newBet.players = _players;
        newBet.timestamp = block.timestamp;
        newBet.settled = false;

        userBetCount[msg.sender]++;

        emit BetCreated(betId, _betType, _amount, _players, block.timestamp);
        return betId;
    }

    function settleBet(bytes32 _betId, string[] memory _winners) external {
        Bet storage bet = bets[_betId];
        require(!bet.settled, "Bet already settled");
        require(bytes(bet.betType).length > 0, "Bet does not exist");

        for (uint i = 0; i < _winners.length; i++) {
            bet.results[_winners[i]] = true;
        }

        bet.settled = true;
        emit BetSettled(_betId, _winners);
    }

    function getBetDetails(bytes32 _betId)
        external
        view
        returns (
            string memory betType,
            uint256 amount,
            string[] memory players,
            uint256 timestamp,
            bool settled
        )
    {
        Bet storage bet = bets[_betId];
        require(bytes(bet.betType).length > 0, "Bet does not exist");

        return (
            bet.betType,
            bet.amount,
            bet.players,
            bet.timestamp,
            bet.settled
        );
    }

    function isPremiumUser(address _user) public pure returns (bool) {
        // TODO: Implement premium user check logic
        return false;
    }
} 