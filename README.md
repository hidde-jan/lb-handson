# Hands-on box for Learning Blockchain

1. Install node 6LTS+ and truffle, install metamask in Chrome
   - https://nodejs.org/en/download/
   - http://truffleframework.com/
   - https://metamask.io/
2. Open a terminal and make a new directory
    mkdir handson
3. Change to the newly created directory
    cd handson
4. Download this project:
    truffle unbox hidde-jan/lb-handson
4. Install needed depedencies
    npm install
5. Starts the fake ethereum blockchain
    truffle develop --log
6. In a separate terminal, go to the same directory and start the truffle development terminal
    truffle develop
6. In the truffle terminal, compile the included smart contracts
    truffle(develop)> compile
7. Migrate the compiled contracts to the blockchain
    truffle(develop)> migrate
8. In separate terminal, same directory, start the web server:
    npm run dev
9. Configure metamask. Use the following seed phrase:
   > candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
10. Open `localhost:3000` in Chrome.
11. Try to issue a new certificate.
12. Validate the issued certificate.
13. Change something and check if it is still valid.
14. Revoke the certificate and check if it is still valid.
