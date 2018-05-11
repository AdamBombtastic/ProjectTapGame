/** 
 * mainMenu.js
 * Date:4/6/2016
 * Programmer: Adam Austin
 * 
 * 
 * 
*/

var mainMenuState = {

    mainText: null,
    goldText : null,
    renownText: null,
    battleText: null,
    settingsText: null,
    ConfirmationDialogFinish: function(obj) {
        obj.kill();
    },
    init : function() {
       // setGameScale();

       var tempQ = QuestFactory.CreateQuest("Prove yourself","Dear Hero," + 
        "\n \t Everyone knows that you're the biggest wuss here. I bet if you beat a couple monsters and got a few good hits in, people would stop thinking that.","Mom");
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.KILL_MON, amount: 7}]);
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.ATTACK_MON, amount: 20}]);
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus"},"Defeat Anitmus");
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus Prime"},"Defeat Antimus Prime");
        QuestFactory.SetReward(tempQ, {exp: 5, gold: 200});
        if (GAME.isFirstMail && PLAYER.mail.length == 0) {
           PLAYER.mail.push(tempQ);
        }
    },
    create : function() {

        game.stage.backgroundColor = 0x999999;

        var possibleNames = ["Tap Arena", 
        "Colliseum Crashers", 
        "A Bugs Life: X Rated", 
        "Catch Me Outside", 
        "Arena!", 
        "Swipe Heroes", 
        "Tinder",
        "Roy",
        "Hanky Panky",
        "Super Smash Sass",
        "Andy's Revenge",
        "Secret of Drama",
        "Kingdom Farts"];


        this.mainText = game.add.text(game.world.centerX,game.world.centerY,"<INSERT GAME NAME HERE>", {font: "72px Verdana", fill: "White"});
        this.mainText.centerX = game.world.centerX;
        this.mainText.centerY = game.world.centerY-220;
        this.mainText.inputEnabled = true;

        this.mainText.events.onInputDown.add(function() {
            this.mainText.text = "<"+possibleNames[randomInt(0,possibleNames.length)]+">";
            
            this.mainText.centerX = game.world.centerX;
            this.mainText.centerY = game.world.centerY-200;
    
        },this);

        //var aboutText = game.add.text(game.world.centerX,game.world.centerY,"Gage and Adam present", {font: "40px Arial", fill: "White"});
       // aboutText.centerX = game.world.centerX;
        //aboutText.centerY = game.world.centerY - 240;

        this.battleText = game.add.sprite(0,0,"menu_btns_blank",0);
        this.bText = game.add.text(game.world.centerX,game.world.centerY,"Battle",{font: "60px Arial", fill: "Black"});
        var battleTextAnims = {pressed: null, normal: null}
        battleTextAnims.normal = this.battleText.animations.add("normal",[0]);
        battleTextAnims.pressed = this.battleText.animations.add("pressed",[1]);
        //this.battleText.scale.setTo(0.65,0.65);
        this.battleText.centerX = game.world.centerX;
        this.battleText.centerY = game.world.centerY-50;
        this.bText.centerX = this.battleText.centerX;
        this.bText.centerY = this.battleText.centerY;
        this.battleText.inputEnabled = true;
        this.battleText.events.onInputOver.add(function() {
            battleTextAnims.pressed.play(1,true);
        },this);
        this.battleText.events.onInputOut.add(function() {
            battleTextAnims.normal.play(1,true);
        },this);
        this.battleText.events.onInputUp.add(function() {
            NavigationManager.pushState("chooseWeapon",{isRandom:false},false);
        },this);

        this.randomBattleText = game.add.sprite(0,0,"menu_btns_blank",0);//game.add.text(game.world.centerX,game.world.centerY,"Battle",{font: "60px Arial", fill: "White"});
        var rText = game.add.text(game.world.centerX,game.world.centerY,"Random",{font: "60px Arial", fill: "Black"});
        var randomBattleTextAnims = {pressed: null, normal: null}
        randomBattleTextAnims.normal = this.randomBattleText.animations.add("normal",[0]);
        randomBattleTextAnims.pressed = this.randomBattleText.animations.add("pressed",[1]);
        //this.randomBattleText.scale.setTo(0.65,0.65);
        this.randomBattleText.centerX = game.world.centerX;
        this.randomBattleText.centerY = game.world.centerY+100;
        rText.centerX = this.randomBattleText.centerX;
        rText.centerY = this.randomBattleText.centerY;
        this.randomBattleText.inputEnabled = true;
        this.randomBattleText.events.onInputOver.add(function() {
            randomBattleTextAnims.pressed.play(1,true);
        },this);
        this.randomBattleText.events.onInputOut.add(function() {

            randomBattleTextAnims.normal.play(1,true);
        },this);
        this.randomBattleText.events.onInputUp.add(function() {
            NavigationManager.pushState("chooseWeapon",{isRandom:true},false);
        },this);
        

        this.settingsText = game.add.sprite(0,0,"menu_btns_temp",0);//game.add.text(game.world.centerX,game.world.centerY,"Options",{font: "60px Arial", fill: "White"});
        var settingsAnims = {normal: null, pressed: null}
        this.settingsText.width = this.randomBattleText.width;
        this.settingsText.height = this.randomBattleText.height;
        settingsAnims.normal = this.settingsText.animations.add("normal",[0]);
        settingsAnims.pressed = this.settingsText.animations.add("pressed",[1]);
        this.settingsText.centerX = game.world.centerX;
        this.settingsText.centerY = game.world.centerY+250;
        this.settingsText.inputEnabled = true;
        this.settingsText.events.onInputOver.add(function() {
            settingsAnims.pressed.play(1,true);
            
        },this);
        this.settingsText.events.onInputOut.add(function() {
            settingsAnims.normal.play(1,true);
        },this);
        this.settingsText.events.onInputUp.add(function() {
            var dialog = UIManager.createConfirmationDialog(game.world.centerX,game.world.centerY,"Come back later . . . ;)",true);
            dialog.delegate = this;
        },this);

        this.goldText = game.add.text(5,5,"Gold: " + PLAYER.gold,{font: "30px Arial", fill: "Yellow"});
        this.renownText = game.add.text(5,5+this.goldText.height,"Fans: " + PLAYER.fans,{font: "30px Arial", fill: "Blue"});
        var globalVersionText = game.add.text(1260,10,GLOBAL_VERSION_STRING,{font: "22px Arial", fill: "White"});

        this.mailIcon = game.add.sprite(0,0,"ui_icons_temp",3);
        var mailAnim = this.mailIcon.animations.add("normal",[3]);
        var mailAnimFlash = this.mailIcon.animations.add("flash",[2,3]);

        this.mailIcon.scale.setTo(2,2);
        this.mailIcon.centerX = this.settingsText.centerX+400;
        this.mailIcon.centerY = this.settingsText.centerY;

        addHoverEffect(this.mailIcon);
        this.mailIcon.events.onInputUp.add(function() {
            NavigationManager.pushState("mail",{},true);
        },this);
        if (PLAYER.mail.length > 0) {
            mailAnimFlash.play(2,true);
        }
        else mailAnim.play(1,true);
        UIManager.game = game;
        
    },
    update : function() {
        
    }
}

