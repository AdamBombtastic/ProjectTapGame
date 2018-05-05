//UIManager will contain a bunch of UI methods
var UIManager = {
    game : null,
    createUIGraphics : function(x,y,width,height,background=0xFFFFFF,border=0x000000,backAlpha = 0.75,borderAlpha = 1) {
        var tempGraphics = game.add.graphics(x,y);
        
        tempGraphics.beginFill(background,backAlpha);
        tempGraphics.drawRect(0,0,width,height);
        tempGraphics.endFill();

        tempGraphics.lineStyle(2,border,borderAlpha);
        tempGraphics.drawRect(0,0,width,height);
        return tempGraphics;
    },
    createUIPanel : function(x,y,width,height,background=0xFFFFFF,border=0x000000,backAlpha = 0.75,borderAlpha = 1) {
        var tempGraphics = this.createUIGraphics(x,y,width,height,background,border,backAlpha,borderAlpha);

        var tempSprite = game.add.sprite(x,y,tempGraphics.generateTexture());
        tempGraphics.destroy();
        return tempSprite;
    },
    createConfirmationDialog : function(x,y,message,background=0x784212,border=0xFFFFFF,backAlpha=0.95,borderAlpha=1) {
        var tempPanel = this.createUIPanel(x,y,500,225,background,border,backAlpha,borderAlpha);
        
        var tempText = game.add.text(x,y-30,message,{font: "28px Arial", fill: "White"});

        var returnObj = {response:null,delegate:null}
        var confirmButton = game.add.sprite(x,y,"ui_icons_temp",0);
        confirmButton.inputEnabled = true;
        confirmButton.animations.add("go",[0]).play(1,true);
        confirmButton.events.onInputOver.add(function() {
            tintSprite(confirmButton,0x555555);
        },this);
        confirmButton.events.onInputOut.add(function() {
            tintSprite(confirmButton,0xFFFFFF);
        },this);
        confirmButton.events.onInputUp.add(function() {
            returnObj.response = true;
            returnObj.delegate.ConfirmationDialogFinish(returnObj);
        },this);

        var cancelButton = game.add.sprite(x,y,"ui_icons_temp",1);
        cancelButton.animations.add("go",[1]).play(1,true);
        cancelButton.events.onInputOver.add(function() {
            tintSprite(cancelButton,0x555555);
        },this);
        cancelButton.events.onInputOut.add(function() {
            tintSprite(cancelButton,0xFFFFFF);
        },this);
        cancelButton.events.onInputUp.add(function() {
            returnObj.response = false;
            returnObj.delegate.ConfirmationDialogFinish(returnObj);
        },this);
        cancelButton.inputEnabled = true;

        //confirmButton.scale.setTo(0.,0.75);
        //cancelButton.scale.setTo(0.75,0.75);

        tempPanel.centerX = x;
        tempPanel.centerY = y;

        tempText.centerX = x;
        tempText.centerY = y-50;

        confirmButton.centerX = x-100;
        confirmButton.centerY = y+50;

        cancelButton.centerX = x+100;
        cancelButton.centerY = y+50;

        returnObj.group = game.add.group();
        returnObj.sprite = tempPanel;
        returnObj.text = tempText;
        returnObj.cancel = cancelButton;
        returnObj.ok = confirmButton;

        returnObj.group.add(tempPanel);
        returnObj.group.add(tempText);
        returnObj.group.add(cancelButton);
        returnObj.group.add(confirmButton);

        returnObj.group.scale.setTo(1.5,1.5);
        returnObj.group.centerX = x;
        returnObj.group.centerY = y;

        returnObj.kill = function() {
            tempPanel.kill();
            tempText.kill();
            confirmButton.kill();
            cancelButton.kill();
            
            returnObj = null;
        }


        return returnObj;
    }

}
