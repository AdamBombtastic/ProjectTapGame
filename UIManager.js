//UIManager will contain a bunch of UI methods
var UIStyles = {
   bigFont : {font: "100px Arial", fill: "White"},
   largeFont : {font: "60px Arial", fill: "White"},
   medFont: {font: "40px Arial", fill: "White"},
   smallerFont: {font: "28px Arial", fill:"White"},
   smallFont: {font: "26px Arial", fill: "White"}
}
var UIManager = {
    game : null,
    idcount : 0,
    events : {}, //key, list of objects
    RegisterEvent : function(eName) {
        if (this.events[eName] == null) {
            this.events[eName] = [];
        }
    },
    SubscribeToEvent : function(ename, obj) {
        this.RegisterEvent(ename);
        this.events[ename].push(obj);
    },
    BroadcastEvent : function(ename) {
        //console.log("Broadcasting event: " + ename);
        if (this.events[ename] == null) return;
        for (var i = 0; i < this.events[ename].length;i++) {
            var myObj = this.events[ename][i];
            myObj.UpdateEvent();
        }
    },
    createUIGraphics : function(x,y,width,height,background=0xFFFFFF,border=0x000000,backAlpha = 0.75,borderAlpha = 1,borderSize=2) {
        var tempGraphics = game.add.graphics(x,y);
        
        tempGraphics.beginFill(background,backAlpha);
        tempGraphics.drawRect(0,0,width,height);
        tempGraphics.endFill();

        tempGraphics.lineStyle(borderSize,border,borderAlpha);
        tempGraphics.drawRect(0,0,width,height);
        return tempGraphics;
    },
    createUIPanel : function(x,y,width,height,background=0xFFFFFF,border=0x000000,backAlpha = 0.75,borderAlpha = 1,borderSize=2) {
        var tempGraphics = this.createUIGraphics(x,y,width,height,background,border,backAlpha,borderAlpha,borderSize);

        var tempSprite = game.add.sprite(x,y,tempGraphics.generateTexture());
        tempGraphics.destroy();
        return tempSprite;
    },
    createConfirmationDialog : function(x,y,message,singleButton=false,background=0x784212,border=0xFFFFFF,backAlpha=0.95,borderAlpha=1) {
        
        var tempPanel = this.createUIPanel(x,y,500,225,background,border,backAlpha,borderAlpha);
        
        var tempText = game.add.text(x,y-30,message,{font: "28px Arial", fill: "White",wordWrap: true, wordWrapWidth: 400});

        var returnObj = {id: this.idcount,response:null,delegate:null}
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

        var cancelButton = null;
        if (!singleButton) {
            cancelButton = game.add.sprite(x,y,"ui_icons_temp",1);
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
        }

        //confirmButton.scale.setTo(0.,0.75);
        //cancelButton.scale.setTo(0.75,0.75);

        tempPanel.centerX = x;
        tempPanel.centerY = y;

        tempText.centerX = x;
        tempText.centerY = y-50;

        confirmButton.centerX = x-100;
        confirmButton.centerY = y+50;

        
        if (!singleButton) {
        cancelButton.centerX = x+100;
        cancelButton.centerY = y+50;
        }
        else {
            confirmButton.centerX = x;
        }

        returnObj.group = game.add.group();
        returnObj.sprite = tempPanel;
        returnObj.text = tempText;
        returnObj.cancel = cancelButton;
        returnObj.ok = confirmButton;

        returnObj.group.add(tempPanel);
        returnObj.group.add(tempText);
        if (!singleButton) {
            returnObj.group.add(cancelButton);
        }
        returnObj.group.add(confirmButton);

        returnObj.group.scale.setTo(1.5,1.5);
        returnObj.group.centerX = x;
        returnObj.group.centerY = y;

        returnObj.kill = function() {
            returnObj.group.kill();
            
            returnObj = null;
        }

        this.idcount += 1;
        return returnObj;
    },
    createQuestView : function() {
        var myGroup = game.add.group();
        var myPanel = this.createUIPanel(game.world.centerX,game.world.centerY,1000,550,background=0x784212,border=0xFFFFFF,backAlpha=0.95,borderAlpha=1);
        myPanel.centerX = game.world.centerX;
        myPanel.centerY = game.world.centerY;

        var titleText = game.add.text(myPanel.x+20,myPanel.y+20,"Quest Book",UIStyles.medFont);
        
        var infoPanel = this.createUIPanel(myPanel.x +550,myPanel.y+ 80,430,450,0xFFFFFF,0xFFFFFF,0.1,1);
        var requireContextText= game.add.text(infoPanel.x+20,infoPanel.y+20 ,"",UIStyles.smallFont);
        var statusText = game.add.text(infoPanel.x+20,requireContextText.y+20+requireContextText.height,"",UIStyles.smallFont);
        var rewardButton = game.add.sprite(infoPanel.centerX,myPanel.y+435,"ui_icons_temp",0);
        rewardButton.centerX = infoPanel.centerX;

        var exitButton = game.add.sprite(infoPanel.centerX,myPanel.y+435,"ui_icons_temp",1);
        addHoverEffect(exitButton);
        exitButton.scale.setTo(0.75,0.75);
        exitButton.y = myPanel.y+5;
        exitButton.x = myPanel.x+915;

        exitButton.events.onInputUp.add(function() {
            myGroup.visible = false;
            exitButton.tint = 0xFFFFFF;
            
        });

        addHoverEffect(rewardButton);
        rewardButton.visible= !(this.selectedQuest == null || !this.selectedQuest.done);
        
        rewardButton.events.onInputUp.add(function() {
            //TODO: make a better reward indicator & make rewards output what they give you.
            if (this.selectedQuest == null || !this.selectedQuest.done) return;
            var rewardString = StringFormat("Reward: {0} gold and {1} fans",this.selectedQuest.reward.gold,this.selectedQuest.reward.exp);
            var popup = UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,rewardString,true);
            popup.delegate = {ConfirmationDialogFinish: function(obj) {obj.kill();}} //hack in the kill condition. I should make this default behavior.
            PLAYER.fans += this.selectedQuest.reward.exp;
            PLAYER.gold += this.selectedQuest.reward.gold;

            UIManager.BroadcastEvent("updatePlayerGold");
            UIManager.BroadcastEvent("updatePlayerFans");
            
            QuestManager.RemoveQuest(this.selectedQuest);
            rowGroup.kill();
            rowGroup = null;
            rowGroup = game.add.group();
            for (var i = 0; i < QuestManager.quests.length; i++) {
                var myQuest = QuestManager.quests[i];
                var myRow = this.createQuestViewRow(20+myPanel.x,80+myPanel.y+(i*75),myQuest);
                myRow.delegate = this;
                rowGroup.add(myRow.group);
            }
            myGroup.add(rowGroup);
            statusText.text = "";
            requireContextText.text = "";
            rewardButton.visible = false;
            
        },this);

        myGroup.add(myPanel);
        myGroup.add(titleText);
        myGroup.add(infoPanel);
        myGroup.add(requireContextText);
        myGroup.add(statusText);
        myGroup.add(rewardButton);
        myGroup.add(exitButton);

        var rowGroup = game.add.group();
        for (var i = 0; i < QuestManager.quests.length; i++) {
            var myQuest = QuestManager.quests[i];
            var myRow = this.createQuestViewRow(20+myPanel.x,80+myPanel.y+(i*75),myQuest);
            myRow.delegate = this;
            rowGroup.add(myRow.group);
        }
        myGroup.add(rowGroup);
        this.UpdateSelected = function(q) {
            requireContextText.text = q.GetText(true);
            this.selectedQuest = q;
            statusText.text = "Status: ";
            statusText.text += (q.done) ? "Completed" : "In Progress";
            statusText.x = infoPanel.x+20;
            statusText.y = requireContextText.y+20+requireContextText.height;
            rewardButton.visible = false;
            if (q.done) {
                rewardButton.visible = true;
                
            }
        }
        return myGroup;

    },
    createQuestViewRow : function(x,y,quest) {
        var tempPanel = this.createUIPanel(x,y,500,75,0xFFFFFF,0xFFFFFF,0.1,1);
        var myGroup = game.add.group();
        var text = game.add.text(x+5,y+5,quest.title,UIStyles.smallerFont);
        text.centerY = tempPanel.centerY;
        var delegate = null;
        var returnObj = {panel: tempPanel, text: text, delegate : delegate, quest : quest, group:myGroup};
        tempPanel.inputEnabled = true;
        tempPanel.events.onInputUp.add(function () {
           returnObj.delegate.UpdateSelected(returnObj.quest);
        });
        addHoverEffect(tempPanel,0x999999);

        myGroup.add(tempPanel);
        myGroup.add(text)
        return returnObj;
    },
    createItemCard : function(x,y,item,cost) {
        var myGroup = game.add.group();
        var panel = this.createUIPanel(x,y,600,600,0xCCCCCC,ItemManager.GetRarityColor(item),0.5,1,10);
        var strip = this.createUIPanel(x,y,panel.width,panel.height/10,0xFFFFFF,0xFFFFFF,1,1);
        strip.centerX = panel.centerX;
        strip.centerY = panel.centerY+100;
        var itemNameText = game.add.text(panel.x+0,panel.y+200,item.name,{font: "44px Arial",fill:"Black"});
        itemNameText.centerX = panel.centerX;
        itemNameText.centerY = panel.centerY+100;
        //Draw icon, and stat indicators. Color panel background for rarity

        var icon = game.add.sprite(x,y,item.params.icon);
        icon.centerX = panel.centerX;
        icon.centerY = panel.centerY-100;

        //Todo: Replace colors with icons
        var damageText = game.add.text(panel.x, panel.y, item.params.damage,{font: "60px Arial",fill:"Red"});
        damageText.centerX = panel.x+40+(damageText.width/2);
        damageText.centerY = panel.centerY+200;

        var speedText = game.add.text(panel.x, panel.y, item.params.cooldown,{font: "60px Arial",fill:"Green"});
        speedText.centerX = panel.centerX;
        speedText.centerY = panel.centerY+200;

        var duraText = game.add.text(panel.x, panel.y, "100",{font: "60px Arial",fill:"Black"});
        duraText.centerX = (panel.x+panel.width)-(40+(duraText.width/2));
        duraText.centerY = panel.centerY+200;

        var goldText = game.add.text(panel.x+20, panel.y+20,cost+"g",{font: "60px Arial",fill:"Yellow"});
        var ownedText = game.add.text(0,0,"Owned",{font : "60px Arial", fill:"Red"});
        ownedText.x = (panel.x + panel.width) - (ownedText.width + 20);
        ownedText.y = (panel.y+20);

        ownedText.visible = PLAYER.HasItem(item);

        myGroup.add(panel);
        myGroup.add(strip);
        myGroup.add(itemNameText);
        myGroup.add(icon);
        myGroup.add(damageText);
        myGroup.add(speedText);
        myGroup.add(duraText);
        myGroup.add(goldText);
        myGroup.add(ownedText);
        
        return {group:myGroup,icon: icon};
    },

}

/***
 * Navigation manager
 */

 var NavigationManager = {
    stack: [],
    CurrentState : function() {
        if (this.stack.length > 0) {
            return this.stack[this.stack.length-1];
        }
        return null;
    },
    pushState: function(sname,bundle,isAnimated=false) { //New State
        this.stack.push({name:sname,bundle:bundle});
        if (isAnimated) {
            game.camera.onFadeComplete.removeAll();
            game.camera.onFadeComplete.add( function() {game.state.start(sname,true,false,bundle);},this);
            game.camera.fade();
        }
        else game.state.start(sname,true,false,bundle);

        UIManager.events = {};
    },
    popState: function(isAnimated=false) { // BackButton
        if (this.stack.length > 1) {
            this.stack.pop();
            var cState =  this.CurrentState();
            if (isAnimated) {
                game.camera.onFadeComplete.removeAll();
                game.camera.onFadeComplete.add( function() {game.state.start(cState.name,true,false,cState.bundle);},this);
                game.camera.fade();
            }
            else game.state.start(cState.name,true,false,cState.bundle);
            UIManager.events = {};
        }
    },
    ForceState: function(sname,bundle, isAnimated = false) {
        //Using this doesn't allow the player to go back
        this.stack.splice(0,this.stack.length);
        this.stack.push({name:sname,bundle:bundle});
        if (isAnimated) {
            game.camera.onFadeComplete.removeAll();
            game.camera.onFadeComplete.add( function() {game.state.start(sname,true,false,bundle);},this);
            game.camera.fade();
        }
        else game.state.start(sname,true,false,bundle);
        UIManager.events = {};
    }
 }