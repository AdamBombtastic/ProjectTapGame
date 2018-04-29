var rewardState = {
    
    results: {gold: 0, exp: 0, win: false},
    
    init: function(rewardObject) {
        if (rewardObject != null) {
            console.log(rewardObject);
             results = rewardObject;
        }
    },
    preload: function() {
        //STUB
    },
    create: function() {
        
       
        game.add.sprite(-10,-10,"battle_background");
       
        
        PLAYER.gold += results.gold;
        PLAYER.renown += results.exp;
       
        var uiPanel = UIManager.createUIPanel(game.world.centerX,game.world.centerY,1000,500,0x784212,0xFFFFFF,0.9,1);
        uiPanel.centerX = game.world.centerX;
        uiPanel.centerY = game.world.centerY-80;

        var winText = game.add.text(uiPanel.centerX,uiPanel.centerY-220,"VICTORY",{font: "60px Arial", fill: "White"});
        winText.centerX = uiPanel.centerX;

        var goldText = game.add.text(uiPanel.centerX-100,uiPanel.centerY-130,"Gold Earned: +"+results.gold,{font: "40px Arial", fill: "Yellow"});
        goldText.centerX = uiPanel.centerX;

        var expText = game.add.text(uiPanel.centerX-100,uiPanel.centerY-55,"Renown Earned: +"+results.exp,{font: "40px Arial", fill: "RoyalBlue"});
        expText.centerX = uiPanel.centerX;

        var sayingText = game.add.text(uiPanel.centerX-100,uiPanel.centerY+20,"\"You've gained some fans . . .\"",{font: "30px Arial",fontStyle: "italic",fill: "White"});
        sayingText.centerX = uiPanel.centerX;


        var mainMenuBtn = UIManager.createUIPanel(uiPanel.x+95,(uiPanel.y+uiPanel.height)-125-50,375,125,0x777777,0xFFFFFF,0);
        var mainMenuBtnText = game.add.text(uiPanel.x+10,(uiPanel.y+uiPanel.height)-50,"Main Menu",{font: "32px Arial", fill: "White"});
        mainMenuBtnText.centerX = mainMenuBtn.centerX;
        mainMenuBtnText.centerY = mainMenuBtn.centerY;
        mainMenuBtn.inputEnabled = true;
        mainMenuBtn.events.onInputOver.add(function() {
            mainMenuBtn.tint = 0xFF4444;
        },this);
        mainMenuBtn.events.onInputOut.add(function() {
            mainMenuBtn.tint = 0xFFFFFF;
        },this);
        mainMenuBtn.events.onInputUp.add(function() {
            game.state.start("mainMenu");
        }),this;
        

        var nextFightBtn = UIManager.createUIPanel((uiPanel.x+uiPanel.width)-400-95,(uiPanel.y+uiPanel.height)-125-50,375,125,0x777777,0xFFFFFF,0);
        var nextFightBtnText = game.add.text(uiPanel.x+10,(uiPanel.y+uiPanel.height)-50,"Next Fight",{font: "32px Arial", fill: "White"});
        nextFightBtnText.centerX = nextFightBtn.centerX;
        nextFightBtnText.centerY = nextFightBtn.centerY;

        nextFightBtn.inputEnabled = true;
        nextFightBtn.events.onInputOver.add(function() {
            nextFightBtn.tint = 0xFF4444;
        },this);
        nextFightBtn.events.onInputOut.add(function() {
            nextFightBtn.tint = 0xFFFFFF;
        },this);

        nextFightBtn.events.onInputUp.add(function() {
            PLAYER.level += 1;
            if (PLAYER.level > 6) {
                PLAYER.level = 0;
                game.state.start("mainMenu");
            }
            else game.state.start("battle",true,false,{weapon:PLAYER.weapon});
        }),this;
       
        
        //STUB
    },
    update: function() {
        //STUB
    }
     
}