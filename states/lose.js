var loseState = {
    
    create: function() {
        game.stage.backgroundColor = "#000000";
        //TODO: MAKE IT BEAUTIFUL
        var bg = game.add.sprite(-10,-10,"battle_background");
        bg.tint = 0x222222;
        
        results = {gold:0,exp: 0}
       
        var uiPanel = UIManager.createUIPanel(game.world.centerX,game.world.centerY,1000,500,0x784212,0xFFFFFF,0.9,1);
        uiPanel.centerX = game.world.centerX;
        uiPanel.centerY = game.world.centerY-80;

        var winText = game.add.text(uiPanel.centerX,uiPanel.centerY-220,"Defeat",{font: "60px Arial", fill: "Red"});
        winText.centerX = uiPanel.centerX;

        var goldText = game.add.text(uiPanel.centerX-100,uiPanel.centerY-130,"Pride Lost: -"+100,{font: "40px Arial", fill: "White"});
        goldText.centerX = uiPanel.centerX;

        //var expText = game.add.text(uiPanel.centerX-100,uiPanel.centerY-55," +",{font: "40px Arial", fill: "RoyalBlue"});
        //expText.centerX = uiPanel.centerX;

        var sayingText = game.add.text(uiPanel.centerX-100,uiPanel.centerY,"\"Better luck next time . . .\"",{font: "30px Arial",fontStyle: "italic",fill: "White"});
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
            NavigationManager.ForceState("gameMap");
        }),this;
        

        var nextFightBtn = UIManager.createUIPanel((uiPanel.x+uiPanel.width)-400-95,(uiPanel.y+uiPanel.height)-125-50,375,125,0x777777,0xFFFFFF,0);
        var nextFightBtnText = game.add.text(uiPanel.x+10,(uiPanel.y+uiPanel.height)-50,"Try Again",{font: "32px Arial", fill: "White"});
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
            NavigationManager.pushState("battle",{weapon:PLAYER.weapon},false);
        }),this;
       
        
    },
}