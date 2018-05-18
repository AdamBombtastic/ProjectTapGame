/**
 * Name: upgrade.js
 * Date: 5/15/2018
 * Programmer: Adam Austin
 * 
 * This state will be the players house and it will be where the player upgrade their skills with weapons
 * 
 * 
 */



var upgradeState = {
    init : function() {
        
    },
    create : function() {
        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.popState(false);
        },this);

    },
    update : function() {

    }
}