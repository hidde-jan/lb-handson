# Hands-on box for Learning Blockchain

1. Install node 6LTS+ and truffle, install metamask in Chrome
   - https://nodejs.org/en/download/
   - http://truffleframework.com/
   - https://metamask.io/
   
2. Open a terminal and make a new directory

       $ mkdir handson

3. Change to the newly created directory

       $ cd handson

4. Download this project:

       $ truffle unbox hidde-jan/lb-handson

4. Install needed depedencies

       $ npm install

5. Starts the dummy ethereum blockchain

       $ truffle develop

   (If you want extra details, like the ethereum calls and transactions, you can start a separate terminal, then go to the same directory and run:)

       $ truffle develop --log

6. In the truffle terminal, compile the included smart contracts

       truffle(develop)> compile

7. Migrate the compiled contracts to the blockchain

       truffle(develop)> migrate

8. Open a separate terminal window, go to the same directory (with `cd`) and start the web server:

       $ npm run dev

9. Open `localhost:3000` in Chrome. It should say "EtherCerts" at the top of the page.

10. (Next steps follow [intructions from Truffle's pet-shop tutorial](http://truffleframework.com/tutorials/pet-shop#installing-and-configuring-metamask) which provides helpful images)

11. Configure metamask by clicking on the icon in the top right corner. Accept the terms and conditions. In the password screen, click "Import Existing DEN". Use the following seed phrase:
   > candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
   
   Enter any password of your liking.
   
12. Next, click where it says 'Main network'. A dropdown appears. Click on "Custom RPC".
13. Enter `http://localhost:9545` and click save.
14. Reload `http://localhost:3000`. At the top of the page, both "your address" and "contract address" should be filled.

## Hands-on part

1. Try to issue a new certificate to yourself.
    1. Fill in your own name and the address from the top of the page.
    2. Click the 'Issue' button.
    3. Accept the transaction.
2. Validate the newly issued certificate
    1. Copy the json of the certificate.
    2. Paste it into the field at the bottom of the page.
    3. Click 'Validate'.
17. Change something and check if it is still valid.
    1. Edit your name in the validation field, or change your grade.
    2. Is it still valid?
18. Revoke the certificate and check if it is still valid.
    1. Click the revoke button for the certificate.
    2. Accept the transaction.
    3. Did it work? Why not?
    4. Try to revoke it again, increase the gas.
    5. Does it work now?
    6. Check if the certificate is still valid.
