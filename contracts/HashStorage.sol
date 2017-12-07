pragma solidity ^0.4.4;

contract HashStorage {

  address public owner;

  mapping(address => bytes32[]) hashes;

  function HashStorage() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function add(address _receiver, bytes32 _hash) public onlyOwner returns (bool) {
    require(_receiver != address(0));
    require(_hash != bytes32(0));

    for (uint i = 0; i < hashes[_receiver].length; i++) {
      if(hashes[_receiver][i] == _hash){
        return false;
      }
    }

    hashes[_receiver].push(_hash);

    return true;
  }

  function revoke(address _receiver, bytes32 _hash) public onlyOwner returns (bool) {
    require(_receiver != address(0));
    require(_hash != bytes32(0));

    for (uint i = 0; i < hashes[_receiver].length; i++) {
      if(hashes[_receiver][i] == _hash){
        delete hashes[_receiver][i];
      }
    }

    return true;
  }

  function verify(address _receiver, bytes32 _hash) public constant returns (bool) {
    require(_receiver != address(0));
    require(_hash != bytes32(0));

    for (uint i = 0; i < hashes[_receiver].length; i++){
      if(hashes[_receiver][i] == _hash){
        return true;
      }
    }

    return false;
  }
}
