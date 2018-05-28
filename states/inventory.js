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
    selectedIndex: 0,
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
            UIManager.SubscribeToEvent("selectChanged",myIcon);
            myIcon.events.onInputUp.add(function(obj) {
                if (obj.uniqueProp != null) {
                    var tempItem = inventoryState.invGrid.items[obj.uniqueProp].item;
                    inventoryState.selectedIndex = obj.uniqueProp;
                    UIManager.BroadcastEvent("selectChanged");
                    ////if (tempItem.type == ITEM_TYPES.WEAPON) {
                    //    PLAYER.weapon = tempItem.id;
                   //     UIManager.BroadcastEvent("equipChanged");
                   // }
                }
            },this);

            myIcon.UpdateEvent = function() {
                tintSprite(myIcon,0xFFFFFF);
                if (index == inventoryState.selectedIndex)tintSprite(myIcon,0x1111FF);
                
            }
        }
        addHoverEffect(panel);
    
        return {group: myGroup, icon: myIcon, item : item, equipText: equippedText, index: index}
    },
    init: function() {
        this.invGrid = {items : [], group : null}
        this.selectedIndex = 0;
    },
    create: function() {

        game.stage.backgroundColor = 0xd2b48c;

        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.popState(false);
        },this);

        this.invGrid.group = game.add.group();
        var count = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var tempCell = this.CreateItemCell(185+(j*155),80+(i*155),PLAYER.items[count],count);
                this.invGrid.items.push(tempCell);
                this.invGrid.group.add(tempCell.group);
                count+=1;
            }
        }

        var infoPanel = UIManager.createUIPanel((5*155)+120,80,400,(155*4)-32,0xFFFFFF,0xFFFFFF,0,1,4);
        var infoTextTitle = game.add.text(infoPanel.x+5,infoPanel.y+5,"Item Info",{font:"40px Arial",fill:"White"});
        infoTextTitle.centerX = infoPanel.centerX;

        var equipButton = UIManager.createUIPanel(infoPanel.x,infoPanel.y+350,380,100,0xFFFFFF,0XFFFFF,0.6,0);
        equipButton.centerX = infoPanel.centerX;
        equipButton.y = (infoPanel.y + infoPanel.height) - (equipButton.height+10);
        var equipText = game.add.text(0,0,"Equip",{font:"40px Arial",fill:"Black"});
        equipText.centerX = equipButton.centerX;
        equipText.centerY = equipButton.centerY;

        equipText.inputEnabled = true;
        equipButton.inputEnabled = true;
        var equipGroup = game.add.group();
        equipGroup.add(equipButton);
        equipGroup.add(equipText);

        equipGroup.onChildInputDown.add(function() {
            tintSprite(equipButton,0x666666);
            tintSprite(equipText,0x666666);
        });
        equipGroup.onChildInputUp.add(function() {
            var tempItem = inventoryState.invGrid.items[inventoryState.selectedIndex].item;
            if (tempItem.type == ITEM_TYPES.WEAPON) {
                PLAYER.weapon = tempItem.id;
                UIManager.BroadcastEvent("equipChanged");
            }
            tintSprite(equipButton,0xFFFFFF);
            tintSprite(equipText,0xFFFFFF);
        },this);

        addHoverEffect(equipButton);
        addHoverEffect(equipText);

        equipButton.events.onInputUp.add(function(obj) {
        
        },this);
        equipGroup.visible = false;

        if (this.invGrid.items.length > 0 && this.invGrid.items[0].item != null) {
            var tempItem = this.invGrid.items[this.selectedIndex].item;
           
            var currentItemIcon = game.add.sprite(infoTextTitle.x,infoTextTitle.y,this.invGrid.items[this.selectedIndex].item.params.icon);
            currentItemIcon.y = infoTextTitle.y+infoTextTitle.height+10;
            currentItemIcon.centerX = infoPanel.centerX;

            var itemInfoText = game.add.text(infoPanel.x + 10, currentItemIcon.y + currentItemIcon.height+20," ", {font: "22px Arial", fill:"White", wordWrap:true, wordWrapWidth:380});
            itemInfoText.text = "Name: " + tempItem.name + "\n";
            itemInfoText.text += "Description: " + tempItem.desc + "\n";
            itemInfoText.text += "Damage: " + tempItem.params.damage + "\n";
            itemInfoText.text += "Cooldown: " + tempItem.params.cooldown + "\n";
            itemInfoText.text += "Durability: " + 100 + "\n";

            UIManager.SubscribeToEvent("selectChanged",itemInfoText);
            UIManager.SubscribeToEvent("selectChanged",currentItemIcon);
            UIManager.SubscribeToEvent("selectChanged",equipGroup);

            currentItemIcon.UpdateEvent= function() {
                var tempItem = inventoryState.invGrid.items[inventoryState.selectedIndex].item;
                this.loadTexture(tempItem.params.icon);
            }
            itemInfoText.UpdateEvent = function() {
                var tempItem = inventoryState.invGrid.items[inventoryState.selectedIndex].item;
                itemInfoText.text = "Name: " + tempItem.name + "\n";
                itemInfoText.text += "Description: " + tempItem.desc + "\n";
                itemInfoText.text += "Damage: " + tempItem.params.damage + "\n";
                itemInfoText.text += "Cooldown: " + tempItem.params.cooldown + "\n";
                itemInfoText.text += "Durability: " + 100 + "\n";
    
            }
            equipGroup.visible = tempItem.type == ITEM_TYPES.WEAPON ||tempItem.ITEM_TYPES.OFFHAND;
            equipGroup.UpdateEvent = function() {
                var tempItem = inventoryState.invGrid.items[inventoryState.selectedIndex].item;
                equipGroup.visible = tempItem.type == ITEM_TYPES.WEAPON ||tempItem.ITEM_TYPES.OFFHAND;
            }
        }
    },
    update: function() {
        if (this.invGrid.items.length > 0 && this.invGrid.items[this.selectedIndex].item != null) {
            tintSprite(this.invGrid.items[this.selectedIndex].icon,0xAAAAEE);
        }
    }
    
}