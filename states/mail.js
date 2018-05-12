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
    currentMailIndex:0,
    ConfirmationDialogFinish : function(obj) {
        //NavigationManager.popState(false);
        if (obj.uniqueProp == "deleteQuest") {
            if (obj.response) {
                this.mail.splice(this.mail.indexOf(this.mail[this.currentMailIndex]),1); //Remove the Quest from Mail
                this.currentMailIndex-=1;
                if (this.currentMailIndex < 0) this.currentMailIndex = 0;
                NavigationManager.ForceState("mail",{mailIndex:this.currentMailIndex+1},false);
                //TODO: add swiping
            }
        }
        obj.kill();
    },
    MailDialogResult : function(answer) {
        //Accept the Quest
        if (answer) {
            QuestManager.AddQuest(this.mail[this.currentMailIndex]);
            this.mail.splice(this.mail.indexOf(this.mail[this.currentMailIndex]),1); //Remove the Quest from Mail
            this.currentMailIndex-=1;
            if (this.currentMailIndex < 0) this.currentMailIndex = 0;
            NavigationManager.ForceState("mail",{mailIndex:this.currentMailIndex+1},false);
            
        }
        //Delete the Quest
        else {
            var tempDialog = UIManager.createConfirmationDialog(game.world.centerX,game.world.centerY,"Are you sure you want to trash this letter?");
            tempDialog.delegate = this;
            tempDialog.uniqueProp = "deleteQuest";
        }
    },
    init : function(bundle) {
        //Grab previous state info so we know where to push the player after this
        this.mail = PLAYER.mail;
        
        if (bundle != null && bundle.mailIndex != null) {
            console.log(bundle);
            this.currentMailIndex = bundle.mailIndex;
        }
        else this.currentMailIndex = 0;

        this.currentMailIndex = (this.currentMailIndex >= this.mail.length) ? this.mail.length-1 : this.currentMailIndex;
        this.currentMailIndex = (this.currentMailIndex < 0) ? 0 : this.currentMailIndex;
    },
    create : function() {
        game.stage.backgroundColor = 0x555555;
        
        
        this.backArrow = game.add.sprite(8,8,"back_arrow");
        this.backArrow.scale.setTo(3,3);
        addHoverEffect(this.backArrow);
        this.backArrow.events.onInputUp.add(function() {
            NavigationManager.popState(false);
        },this);

        

        if(this.mail.length == 0) {
            UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,"Doesn't look like you have any mail, come back later!",true).delegate = this;
        }
        else {
            var titleTextStyle = {font: "30px Arial", fill: "White"};
            var messageTextStyle = {font: "22px Arial", fill: "White", wordWrap: true, wordWrapWidth: 580};
            var subtitleTextStyle = {font: "26px Arial", fill: "white",wordWrap: true, wordWrapWidth : 580};

            var mailItem = game.add.text(0,0,(this.currentMailIndex+1) + " / " + this.mail.length,titleTextStyle);
            mailItem.centerX = game.world.centerX;
            mailItem.centerY = 30;

            var mItem = this.mail[this.currentMailIndex];
            //TODO: Wrap this in a function call, for now -- IF STATEMENT. Don't worry it hurts me too.
            

            var panel = UIManager.createUIPanel(0,0,600,600,0x784212,0xFFFFFF,0.9,1);
            panel.centerX = game.world.centerX;
            panel.centerY = game.world.centerY;
            
            var panelTitle = game.add.text(0,0,mItem.title,titleTextStyle);
            panelTitle.centerX = panel.centerX;
            panelTitle.centerY = (panel.centerY-panel.height/2)+panelTitle.height+5;
            
            var panelContent = game.add.text(0,0,mItem.message,messageTextStyle);
            panelContent.x = panel.x+10;
            panelContent.y = panelTitle.y+panelTitle.height+30;

            var panelFrom = game.add.text(0,0," - "+mItem.from,messageTextStyle);
            panelFrom.x = panel.x+10;
            panelFrom.y = panelContent.y + panelContent.height+20;

            var requirementText = game.add.text(panel.centerX,panelFrom.y +panelFrom.height + 40,"Request Info",subtitleTextStyle)
            requirementText.centerX = panel.centerX;
            var requireContextText= game.add.text(panel.x+20,requirementText.y + requirementText.height + 20,mItem.GetText(),messageTextStyle);
            

            var confirmButton = game.add.sprite(0,0,"ui_icons_temp",0);
            confirmButton.inputEnabled = true;
            confirmButton.animations.add("go",[0]).play(1,true);
            confirmButton.delegate = this;
            confirmButton.events.onInputUp.add(function() {
                confirmButton.delegate.MailDialogResult(true);
            },this);
            confirmButton.centerX = panel.centerX - 80;
            confirmButton.y = (panel.centerY + panel.height/2) - (10+confirmButton.height);

            var cancelButton = null;
            cancelButton = game.add.sprite(0,0,"ui_icons_temp",1);
            cancelButton.animations.add("go",[1]).play(1,true);
            cancelButton.delegate = this;
            cancelButton.events.onInputUp.add(function() {
                cancelButton.delegate.MailDialogResult(false);
            },this);
            cancelButton.inputEnabled = true;
            cancelButton.centerX = panel.centerX + 80;
            cancelButton.y = (panel.centerY + panel.height/2) - (10+cancelButton.height);
            
            addHoverEffect(cancelButton);
            addHoverEffect(confirmButton);

            if (this.currentMailIndex > 0) {
                this.backMailArrow = game.add.sprite(0,game.world.centerY,"back_arrow");
                
                this.backMailArrow.scale.setTo(3,3);
                this.backMailArrow.x = panel.x - 50 - (this.backMailArrow.width/2);
                addHoverEffect(this.backMailArrow);
                this.backMailArrow.events.onInputUp.add(function() {
                    //NavigationManager.popState(false);
                    NavigationManager.ForceState("mail",{mailIndex:this.currentMailIndex-1},false);
                },this);
             }
            if (this.currentMailIndex < this.mail.length-1) {
                this.frontMailArrow = game.add.sprite(8,game.world.centerY,"back_arrow");
                
                this.frontMailArrow.scale.setTo(-3,3);
                this.frontMailArrow.centerX = panel.x + panel.width + 50;
   
                addHoverEffect(this.frontMailArrow);
                this.frontMailArrow.events.onInputUp.add(function() {
                    //NavigationManager.popState(false);
                    NavigationManager.ForceState("mail",{mailIndex:this.currentMailIndex+1},false);
                },this);
            }
        }
        if (GAME.isFirstMail) {
            var d = UIManager.createConfirmationDialog(game.world.centerX, game.world.centerY,"You can use the mail screen to respond to requests from fans!",true);
            d.delegate = this;
            d.uniqueProp = "Hint"; //I know I know
            GAME.isFirstMail = false;
        }
    


    },
    update : function() {

    }
}