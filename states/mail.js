/** 
 * mail.js
 * Date: 5/5/2018
 * Programmer: Adam Austin
 * 
 *  This state is called when the player decides to open their mailbox
 * 
*/

var mailState = {
    mail:null,
    ConfirmationDialogFinish : function(obj) {
        //NavigationManager.popState(false);
        obj.kill();
    },
    MailDialogConfirm : function(obj) {
    
    },
    init : function(bundle) {
        //Grab previous state info so we know where to push the player after this
        this.mail = PLAYER.mail;
        var tempQ = QuestFactory.CreateQuest("Prove yourself","Dear Hero," + 
        "\n \t Everyone knows that you're the biggest wuss here. I bet if you beat a couple monsters and got a few good hits in, people would stop thinking that.","Mom");
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.KILL_MON, amount: 7}]);
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.ATTACK_MON, amount: 20}]);
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus"},"Defeat Anitmus");
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus Prime"},"Defeat Antimus Prime");
        QuestFactory.SetReward(tempQ, {exp: 5, gold: 200});
        this.mail.push(tempQ);
    },
    create : function() {

        var titleTextStyle = {font: "30px Arial", fill: "White"};
        var messageTextStyle = {font: "22px Arial", fill: "White", wordWrap: true, wordWrapWidth: 580};
        var subtitleTextStyle = {font: "26px Arial", fill: "white",wordWrap: true, wordWrapWidth : 580};

        game.stage.backgroundColor = 0x555555;

        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.popState(false);
        },this);

        var panel = UIManager.createUIPanel(0,0,600,600,0x784212,0xFFFFFF,0.9,1);
        panel.centerX = game.world.centerX;
        panel.centerY = game.world.centerY;
        
        var panelTitle = game.add.text(0,0,this.mail[0].title,titleTextStyle);
        panelTitle.centerX = panel.centerX;
        panelTitle.centerY = (panel.centerY-panel.height/2)+panelTitle.height+5;
        
        var panelContent = game.add.text(0,0,this.mail[0].message,messageTextStyle);
        panelContent.x = panel.x+10;
        panelContent.y = panelTitle.y+panelTitle.height+30;

        var panelFrom = game.add.text(0,0," - "+this.mail[0].from,messageTextStyle);
        panelFrom.x = panel.x+10;
        panelFrom.y = panelContent.y + panelContent.height+20;

        var requirementText = game.add.text(panel.centerX,panelFrom.y +panelFrom.height + 40,"Request Info",subtitleTextStyle)
        requirementText.centerX = panel.centerX;
        var requireContextText= game.add.text(panel.x+20,requirementText.y + requirementText.height + 20,this.mail[0].GetText(),messageTextStyle);
        

        var confirmButton = game.add.sprite(0,0,"ui_icons_temp",0);
        confirmButton.inputEnabled = true;
        confirmButton.animations.add("go",[0]).play(1,true);
    
        confirmButton.events.onInputUp.add(function() {
        },this);
        confirmButton.centerX = panel.centerX - 80;
        confirmButton.y = (panel.centerY + panel.height/2) - (10+confirmButton.height);

        var cancelButton = null;
        cancelButton = game.add.sprite(0,0,"ui_icons_temp",1);
        cancelButton.animations.add("go",[1]).play(1,true);
        cancelButton.events.onInputUp.add(function() {
            
        },this);
        cancelButton.inputEnabled = true;
        cancelButton.centerX = panel.centerX + 80;
        cancelButton.y = (panel.centerY + panel.height/2) - (10+cancelButton.height);
        
        addHoverEffect(cancelButton);
        addHoverEffect(confirmButton);

        if (GAME.isFirstMail) {
            UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,"You can use the mail screen to respond to requests from fans!",true).delegate = this;
            GAME.isFirstMail = false;
        }


    },
    update : function() {

    }
}