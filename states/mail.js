/** 
 * Armory.js
 * Date: 5/5/2018
 * Programmer: Adam Austin
 * 
 *  This state is called when the player decides to open their mailbox
 * 
*/

var mailState = {
    ConfirmationDialogFinish : function(obj) {
        game.state.start("mainMenu");
    },
    init : function(bundle) {
        //Grab previous state info so we know where to push the player after this
    },
    create : function() {
        game.stage.backgroundColor = 0x555555;

        UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,"You can use the mail screen to respond to requests from fans!",true).delegate = this;



    },
    update : function() {

    }
}