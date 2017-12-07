App = {
  web3Provider: null,
  contractAddress: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('HashStorage.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var HashStorageArtifact = data;
      App.contracts.HashStorage = TruffleContract(HashStorageArtifact);

      // Set the provider for our contract
      App.contracts.HashStorage.setProvider(App.web3Provider);

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              alert(error);
          }

          $("#your-address").html(accounts[0]);
      });

      App.contracts.HashStorage.deployed().then(function (instance) {
          App.contractAddress = instance.address;
          $("#contract-address").html(instance.address);
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    // $(document).on('click', '.btn-adopt', App.handleAdopt);
    var form = $("#cert-vals");
    form.on('change', ':input', App.getFormValues);

    $(document).on('click', '.btn-issue', App.handleIssue);

    return App.finalize();
  },

  finalize: function () {
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  getFormValues: function(event) {
    var form = $("#cert-vals"), pre = $("#json-preview"), obj = {};
    form.serializeArray().forEach(function (input) {
        obj[input.name] = input.value;
    });

    pre.data("json", obj);
    pre.html(JSON.stringify(obj, null, 2));
  },

  handleIssue: function(event) {
      event.preventDefault();

      var obj = $("#json-preview").data("json");
      console.info(obj);

      obj.contract = App.contractAddress;
      var hash = objectHash(obj);
      var address = obj.address;

      var storageInstance;

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];

          App.contracts.HashStorage.deployed().then(function(instance) {
              storageInstance = instance;

              // Execute adopt as a transaction by sending account
              return storageInstance.add(address, hash, {from: account});
          }).then(function(result) {
              console.log("Issued!");
              var pre = $("#issued");
              obj.hash = hash;
              pre.html(JSON.stringify(obj, null, 2));
              return App.markAdopted();
          }).catch(function(err) {
              console.log(err.message);
          });
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
