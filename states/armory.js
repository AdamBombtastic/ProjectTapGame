/** 
 * Armory.js
 * Date: 4/6/2018
 * Programmer: Adam Austin
 * 
 * Version: 2.0 Date: 5/16/2018
 * 
 * This state is called when the player decides to open the shop screen
 * 
*/
var ShopManager = {
    items  : [new ItemSword(), new ItemClub(), new ItemSpear()],
}
var armoryState = {
    
    shopIndex : 0,
    shopCard : null,
    confirmDialog: null,
    ConfirmationDialogFinish : function(obj) {
        obj.kill();
        this.confirmDialog = null;
    },
    loadItem : function(shopIndex) {
        this.shopIndex = shopIndex;
        var itemCard = UIManager.createItemCard(game.world.centerX, game.world.centerY, ShopManager.items[shopIndex],100);
        itemCard.group.centerX = game.world.centerX;
        itemCard.group.centerY = game.world.centerY;
        this.scrollFor.visible = false;
        this.scrollBack.visible= false;

        if (ShopManager.items.length > 0 && shopIndex > 0) {
            this.scrollBack.visible = true;
        }
        if (ShopManager.items.length > 0 && shopIndex < ShopManager.items.length-1) {
            this.scrollFor.visible = true;
        }
        this.shopCard = itemCard;

        addHoverEffect(itemCard.icon);
        itemCard.icon.events.onInputUp.add(function() {
            if (this.confirmDialog == null) {
                this.confirmDialog = UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,"Purchase Item for 100 gold?");
                this.confirmDialog.delegate = armoryState;
            }
        },this);
    },
    init : function() {
        this.confirmDialog = null;
    },
    create : function() {
        game.stage.backgroundColor = 0xd2b48c;

        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.ForceState("gameMap");
        },this);

        this.scrollBack = game.add.sprite(8,8,"back_arrow");
        this.scrollBack.scale.setTo(3,3);
        addHoverEffect(this.scrollBack);
        this.scrollBack.events.onInputUp.add(function() {
            if (this.confirmDialog == null) {
            this.shopCard.group.kill();
            this.loadItem(this.shopIndex-1);
            }
        },this);
        this.scrollFor = game.add.sprite(8,8,"back_arrow");
        this.scrollFor.scale.setTo(3,3);
        addHoverEffect(this.scrollFor);
        this.scrollFor.events.onInputUp.add(function() {
            if (this.confirmDialog == null) {
            this.shopCard.group.kill();
            this.loadItem(this.shopIndex+1);
            }
        },this);


        this.loadItem(this.shopIndex);
        this.scrollFor.scale.x *= -1;
        this.scrollFor.centerY= game.world.centerY;
        this.scrollFor.centerX = game.world.centerX + 500;

        this.scrollBack.centerY= game.world.centerY;
        this.scrollBack.centerX = game.world.centerX - 500;
        

    },
    update : function() {

    }
}