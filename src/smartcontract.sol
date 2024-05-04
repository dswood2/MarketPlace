// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to represent an NFT item
    struct NFTItem {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool forSale;
    }

    // Mapping to store NFT items by their token IDs
    mapping(uint256 => NFTItem) private _nftItems;

    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {}

    // Event emitted when a new NFT is minted
    event NFTMinted(uint256 indexed tokenId);
    
    // Event emitted when an NFT is bought
    event NFTBought(uint256 indexed tokenId, address indexed buyer);

    // Event emitted when the price of an NFT is set
    event NFTPriceSet(uint256 indexed tokenId, uint256 newPrice);

    // Event emitted when the sale status of an NFT is toggled
    event NFTSaleToggled(uint256 indexed tokenId, bool forSale);

    function mintNFT(uint256 price) public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _nftItems[newTokenId] = NFTItem(newTokenId, msg.sender, price, true);
        emit NFTMinted(newTokenId);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTItem storage item = _nftItems[tokenId];
        require(item.forSale, "NFT is not for sale");
        require(msg.value >= item.price, "Insufficient payment");
        item.forSale = false;
        _transfer(item.owner, msg.sender, tokenId);
        payable(item.owner).transfer(msg.value);
        emit NFTBought(tokenId, msg.sender);
    }

    function setNFTPrice(uint256 tokenId, uint256 newPrice) public {
        NFTItem storage item = _nftItems[tokenId];
        require(msg.sender == item.owner, "Only owner can set the price");
        item.price = newPrice;
        emit NFTPriceSet(tokenId, newPrice);
    }

    function toggleNFTSale(uint256 tokenId) public {
        NFTItem storage item = _nftItems[tokenId];
        require(msg.sender == item.owner, "Only owner can toggle the sale status");
        item.forSale = !item.forSale;
        emit NFTSaleToggled(tokenId, item.forSale);
    }

    function getNFTItem(uint256 tokenId) public view returns (NFTItem memory) {
        return _nftItems[tokenId];
    }
}