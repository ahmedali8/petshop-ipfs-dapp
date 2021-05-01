// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/token/ERC721/ERC721.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/utils/Context.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/utils/Counters.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev {ERC721} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - owner can mint new pets
 *  - owner can set the price of pet
 *  - user can buy pet with ether
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract Petshop is Context, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    // tokenId tracker using lib
    Counters.Counter private _tokenIdTracker;

    // baseURI for metadata
    string private _baseTokenURI;

    // Token prices
    mapping(uint256 => uint256) public tokenPrices;

    // Boolean values either pets are on sale or not
    mapping(uint256 => bool) public petsOnSale;

    event PetCreated(
        address indexed owner,
        uint256 tokenId,
        uint256 price,
        string tokenURI
    );

    event PetPurchase(
        address indexed prevOwner,
        address indexed newOwner,
        uint256 tokenId,
        uint256 price
    );

    event PetPriceChanged(uint256 tokenId, uint256 prevPrice, uint256 newPrice);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }

    receive() external payable {
        revert();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Creates a new token. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event), and the token
     * URI will be set
     *
     * See {ERC721-_safeMint}.
     *
     * Requirements:
     *
     * - the caller must have be the owner of Petshop
     */
    function createPet(uint256 price_, string memory tokenURI_)
        public
        virtual
        onlyOwner()
        returns (uint256)
    {
        // start from tokenId 1
        _tokenIdTracker.increment();

        uint256 tokenId_ = _tokenIdTracker.current();

        // mint pet
        _safeMint(_msgSender(), tokenId_);

        // set tokenURI of pet
        _setTokenURI(tokenId_, tokenURI_);

        // set the price of pet
        tokenPrices[tokenId_] = price_;

        // set onsale to true
        petsOnSale[tokenId_] = true;

        // increment the tokenId
        _tokenIdTracker.increment();

        // emit event
        emit PetCreated(_msgSender(), tokenId_, price_, tokenURI_);
        return tokenId_;
    }

    function buyPet(uint256 tokenId_) public payable returns (bool) {
        require(
            tokenId_ > 0 && _exists(tokenId_),
            "Petshop: tokenId not valid"
        );
        address prevOwner = ownerOf(tokenId_);
        require(
            msg.sender != owner() && msg.sender != prevOwner,
            "Petshop: Owner can't call"
        );
        require(
            msg.value >= tokenPrices[tokenId_],
            "Petshop: Provide valid price for pet"
        );

        // transfer funds to owner
        payable(owner()).transfer(msg.value);

        // transfer pet to new user (clears approvals too)
        safeTransferFrom(owner(), msg.sender, tokenId_);

        emit PetPurchase(prevOwner, msg.sender, tokenId_, msg.value);

        // purchase successful
        return true;
    }

    function changePetPrice(uint256 tokenId_, uint256 price_)
        public
        onlyOwner()
    {
        require(
            tokenId_ > 0 && _exists(tokenId_),
            "Petshop: tokenId not valid"
        );
        uint256 prevPrice_ = tokenPrices[tokenId_];
        tokenPrices[tokenId_] = price_;

        emit PetPriceChanged(tokenId_, prevPrice_, price_);
    }
}
