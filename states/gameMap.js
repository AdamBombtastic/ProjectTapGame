var gameMapState = {
    init : function() {
        var tempQ = QuestFactory.CreateQuest("Prove yourself","Dear Hero," + 
        "\n \t Everyone knows that you're the biggest wuss here. I bet if you beat a couple monsters and got a few good hits in, people would stop thinking that.","Mom");
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.KILL_MON, amount: 7}]);
        QuestFactory.AddRequirements(tempQ,[{action:QuestRequirements.ATTACK_MON, amount: 20}]);
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus"},"Defeat Anitmus");
        QuestFactory.AddKillRequirement(tempQ,1,{ENEMY_NAME: "Antimus Prime"},"Defeat Antimus Prime");
        QuestFactory.SetReward(tempQ, {exp: 5, gold: 200});
        var tempQ2 = QuestFactory.CreateQuest("Disciple of the Sword","Hail young squire," + 
        "\n \t Huzzah! We have heard of your recent arrival at the Coliseum! Me thinks you should try the sword. An elegant weapon for a more civilized champion. Show your valor!","Sir Doofus");
        QuestFactory.AddAttackRequirement(tempQ2,100,{PLAYER_WEAPON: WEAPON_IDS.SWORD},"Attack with sword");
        QuestFactory.AddKillRequirement(tempQ2,1,{ENEMY_NAME: "Antwon"},"Defeat Antwon");
        QuestFactory.SetReward(tempQ2, {exp: 5, gold: 200});
        var tempQ3 = QuestFactory.CreateQuest("The Spear Appears","Howdy Hero," + 
        "\n \t Let me just cut straight to the hog -- It really get's my plow moving when I see spears flashing and whirlin' in the coliseum. Can ya prod a few fellas for me?","Farmer Jimmy");
        QuestFactory.AddAttackRequirement(tempQ3,100,{PLAYER_WEAPON: WEAPON_IDS.SPEAR},"Attack with spear");
        QuestFactory.AddKillRequirement(tempQ3,1,{ENEMY_NAME: "Antwon"},"Defeat Antwon");
        QuestFactory.SetReward(tempQ3, {exp: 5, gold: 200});

        var tempQ4 = QuestFactory.CreateQuest("Clubbin'","Puny hooman," + 
        "\n \t Heard you like swing big club around. Hit puny enemies hard. Club strong. Club thick. Club firm. Use club to hit puny enemy.","Club-Club");
        QuestFactory.AddAttackRequirement(tempQ4,100,{PLAYER_WEAPON: WEAPON_IDS.CLUB},"Attack with club");
        QuestFactory.AddKillRequirement(tempQ4,1,{ENEMY_NAME: "Antwon"},"Defeat Antwon");
        QuestFactory.SetReward(tempQ4, {exp: 5, gold: 200});
        if (GAME.isFirstMail && PLAYER.mail.length == 0) {
           PLAYER.mail.push(tempQ);
           PLAYER.mail.push(tempQ2);
           PLAYER.mail.push(tempQ3);
           PLAYER.mail.push(tempQ4);
        }
        this.questView = null;
    },
    create : function() {
        var mapBg = game.add.sprite(0,0,"map_bg");
        var coliseumButton = game.add.sprite(0,0,"coliseum");
        //addHoverEffect(coliseumButton);
        coliseumButton.inputEnabled = true;
        coliseumButton.events.onInputUp.add(function(from,pointer,isOn) {
            if (this.questView == null || !this.questView.visible) {
                console.log(pointer.x + " " + pointer.y);
                if (pointer.x >= 470 && pointer.x <= 830 && pointer.y >= 70 && pointer.y <=400) {
                    NavigationManager.pushState("mainMenu");
                }
                else if (pointer.x >= 42 && pointer.x <= 295 && pointer.y >= 225 && pointer.y <=475) {
                    NavigationManager.pushState("upgrade");
                }
                else if (pointer.x >= 862 && pointer.x <= 1073 && pointer.y >= 533 && pointer.y <=671) {
                    NavigationManager.pushState("mail");
                }
            }
            //
        },this);

        var mailButton = game.add.sprite(0,0,"post_office_temp");
        //addHoverEffect(mailButton);
        mailButton.events.onInputUp.add(function() {
            ////NavigationManager.pushState("mail");
        },this);

        var houseButton = game.add.sprite(0,0,"house_temp");
        //addHoverEffect(houseButton);
        houseButton.events.onInputUp.add(function() {
            //NavigationManager.pushState("upgrade");
        },this);


        this.bookIcon = game.add.sprite(0,0,"temp_book_icon");
        this.bookIcon.scale.setTo(1,1);
        this.bookIcon.centerX = 1275;
        this.bookIcon.centerY = 65;

        addHoverEffect(this.bookIcon);
        this.questView = null;
        this.bookIcon.events.onInputUp.add(function() {
            if (this.questView == null) {
                this.questView = UIManager.createQuestView();
            }
            else {
                this.questView.visible = !this.questView.visible;
            }
        },this);
    },
    update : function() {

    }
}