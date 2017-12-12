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
              return;
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
    $(document).on('click', '.btn-validate', App.handleValidate);
    $(document).on('click', '.btn-revoke', App.handleRevoke);

    return App.finalize();
  },

  finalize: function () {
  },

  getFormValues: function(event) {
    var form = $("#cert-vals"), pre = $("#json-preview"), obj = {};
    form.serializeArray().forEach(function (input) {
        obj[input.name] = input.value;
    });

    // pre.data("json", obj);
    pre.html(JSON.stringify(obj, null, 2));
  },

  handleRevoke: function(event) {
      event.preventDefault();
      var btn = $(event.target);
      var pre = btn.prev();
      var address = pre.data("address");
      var hash = pre.data("hash");

      console.info("revoking (" + address + ", " + hash + ")");

      var storageInstance;

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];

          App.contracts.HashStorage.deployed().then(function(instance) {
              storageInstance = instance;

              // Execute adopt as a transaction by sending account
              return storageInstance.revoke(address, hash, {from: account});
          }).then(function(result) {
              console.log("Revoked!");
              btn.remove();
              pre.css("text-decoration", "line-through");
              return true;
          }).catch(function(err) {
              alert("Couldn't revoke, probably not enough gas!");
              console.log(err.message);
          });
      });
  },

  handleValidate: function(event) {
      event.preventDefault();
      var t = $("#cert-receipt-json");
      var o = $("#validation-output");

      // Empty validation field
      o.html("");

      try {
          var obj = JSON.parse(t.val());
      } catch (e) {
          alert("Couldn't parse Certificate!");
          return;
      }

      // Valid format
      o.append("<li>✔ Valid format</li>");
      // Check hash
      var checkhash = objectHash(obj);

      o.append("<li>Hash: " + checkhash + "</li>");
      o.append("<li>Checking blockchain...</li>");

      var storageInstance;

      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];

          App.contracts.HashStorage.deployed().then(function(instance) {
              storageInstance = instance;

              // Execute adopt as a transaction by sending account
              return storageInstance.verify.call(obj.address, checkhash, {from: account});
          }).then(function(result) {
              console.log("Checked!");

              if (result) {
                  o.append("<li>✔ Exists on blockchain: valid certificate!</li>");
              } else {
                  o.append("<li>✘ Can't find it on the blockchain: invalid!</li>");
              }
          }).catch(function(err) {
              console.log(err.message);
          });
      });
  },

  handleIssue: function(event) {
      event.preventDefault();

      var obj = JSON.parse($("#json-preview").html());
      console.info(obj);

      obj.contract = App.contractAddress;
      var now = new Date();
      obj['issued-at'] = now.toISOString();
      obj['issuer'] = 'Hogwarts School of Witchcraft and Wizardry';
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
              var issued = $("#issued");
              var hashpre = $("<pre>hash: " + hash + "</pre>");
              var pre = $("<pre></pre>");
              var btn = $("<button type=\"button\" class=\"btn btn-default  btn-revoke\">Revoke :(</btn>");
              pre.html(JSON.stringify(obj, null, 2));
              pre.data("hash", hash);
              pre.data("address", address);
              issued.append(hashpre);
              issued.append(pre);
              issued.append(btn);
              return true;
          }).catch(function(err) {
              alert("Could not issue certificate");
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
