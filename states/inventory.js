/** 
 * 
 * Inventory.js
 * Date: 5/25/2018
 * Programmer: Adam Ausitn
 * 
 * 
*/

/*
    TODO: Add Info panel
          Create Inventory Icoon
          Link to the Main Screen
*/


var inventoryState =  {
    
    invGrid : {items : [], group : null},
    CreateItemCell : function(x,y,item,count) {
        var panel = UIManager.createUIPanel(x,y,120,120,0xFFFFFF,0xFFFFFF,0,1,2);
        var myIcon = null;
        var equippedText = null;
        var myGroup = game.add.group();
        var index = count;
        myGroup.add(panel);
        if (item != null) {
            myIcon = game.add.sprite(x,y,item.params.icon);
            myIcon.width = 120;
            myIcon.height = 120;
            myIcon.centerX  = panel.centerX;
            myIcon.centerY = panel.centerY;
            myIcon.uniqueProp = index;
            myGroup.add(myIcon);
            addHoverEffect(myIcon);
            equippedText = game.add.text(panel.x+2,panel.y+2,"E",{font:"38px Arial", fill:"Red"});
            
            
            if (item.type == ITEM_TYPES.WEAPON) {
                equippedText.visible = (PLAYER.weapon == item.id);
            }
            else if (item.type == ITEM_TYPES.OFFHAND) {
                equippedText.visible = (PLAYER.offhand == item.id);
            }
            else equippedText.visible = false;

            myGroup.add(equippedText);
            
            equippedText.UpdateEvent = function() {
                if (item.type == ITEM_TYPES.WEAPON) {
                    equippedText.visible = (PLAYER.weapon == item.id);
                }
                else if (item.type == ITEM_TYPES.OFFHAND) {
                    equippedText.visible = (PLAYER.offhand == item.id);
                }
                else equippedText.visible = false;
            }
            UIManager.SubscribeToEvent("equipChanged",equippedText);

            myIcon.events.onInputUp.add(function(obj) {
                if (obj.uniqueProp != null) {
                    var tempItem = inventoryState.invGrid.items[obj.uniqueProp].item;
                   
                    if (tempItem.type == ITEM_TYPES.WEAPON) {
                        PLAYER.weapon = tempItem.id;
                        UIManager.BroadcastEvent("equipChanged");
                    }
                }
            },this);
        }
        addHoverEffect(panel);
        

        return {group: myGroup, icon: myIcon, item : item, equipText: equippedText, index: index}
    },
    init: function() {
        this.invGrid = {items : [], group : null}
    },
    create: function() {

        this.invGrid.group = game.add.group();
        var count = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var tempCell = this.CreateItemCell(60+(j*155),60+(i*155),PLAYER.items[count],count);
                this.invGrid.items.push(tempCell);
                this.invGrid.group.add(tempCell.group);
                count+=1;
            }
        }


    },
    update: function() {

    }
    
}