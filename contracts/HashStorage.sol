pragma solidity ^0.4.4; // Require version 0.4.4 or newer

contract HashStorage {

  address public owner;

  mapping(address => bytes32[]) hashes;

  function HashStorage() public {
    owner = msg.sender;
  }

  /*
    Modifiers can be used to change the body of a function (by putting it between the parameter list and function body).
    If this modifier is used, it will prepend a check that only passes if the function is called from a certain address.
  */
  modifier onlyOwner() {
    require(msg.sender == owner);
    /*
    Do not forget the "_;"! It will be replaced by the actual function body when the modifier is used.
    */
    _;
  }

  /*
    Associates a 32-byte hash with the _receiver address.
    The onlyOwner modifier ensures that only the creator (=owner) of this contract can add hashes.
  */
  function add(address _receiver, bytes32 _hash) public onlyOwner returns (bool) {
    require(_receiver != address(0)); // address(0) returns the empty address
    require(_hash != bytes32(0)); // bytes32(0) returns the empty hash

    // First check if hash is already associated with the _receiver address.
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

  /*
    Everyone may verify that a given _hash is associated with a _receiver address.
  */
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
