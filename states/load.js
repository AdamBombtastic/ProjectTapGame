var loadState =  {
    
    preload: function() {
        var loadingLabel = game.add.text(10,10,"Loading Game Assets . . .", {font: "50px Arial", fill: "White"});
        
        //Progress
        game.load.onFileComplete.add( function (progress) {
            loadingLabel.text = "Loading Game Assets: " + progress + "%";
        },this);
        game.load.onLoadComplete.add(function (progress) {
            loadingLabel.text = "Done!";
        },this);

        game.load.image("battle_background",IMAGE_ASSET_PATH + "main_background.png");
        game.load.image("skill_overlay",IMAGE_ASSET_PATH + "test_enemy.png");

        //ANT-TWAN
        //game.load.spritesheet("ant_monster_all",IMAGE_ASSET_PATH + "ant_mon_all.png",372,464,25);
        game.load.spritesheet("ant_monster_all",IMAGE_ASSET_PATH + "ant_mon_all.png",279,348,36);

        game.load.spritesheet("tap_point",IMAGE_ASSET_PATH + "tap_point.png",164,116,16);
        game.load.spritesheet("mana_ball",IMAGE_ASSET_PATH + "mana_ball.png",156,184,21);

        game.load.image("mon_health_bar_back",IMAGE_ASSET_PATH + "monster_health_bar_back.png");
        game.load.image("mon_health_bar_front",IMAGE_ASSET_PATH + "monster_health_bar_front.png");
        game.load.image("mon_health_bar_skull",IMAGE_ASSET_PATH + "monster_health_bar_skull.png");

        // Load player health bars 
        game.load.image("plr_health_bar_back",IMAGE_ASSET_PATH + "Player_Health_Bar.png");
        game.load.image("plr_health_bar_front",IMAGE_ASSET_PATH + "Player_Health_Color.png")

        game.load.image("mon_parry_bar",IMAGE_ASSET_PATH + "monster_parry_bar.png");

        game.load.image("plr_mana_bar_back",IMAGE_ASSET_PATH + "player_mana_bar.png");
        game.load.image("plr_mana_bar_front",IMAGE_ASSET_PATH + "player_mana_color.png")
        
        
        //BUTTONS
        game.load.spritesheet("skill_btn",IMAGE_ASSET_PATH + "skill_btn.png",316,316,2);

        game.load.image("test_nfight_btn",IMAGE_ASSET_PATH + "next_fight_button.png");
        game.load.image("test_cont_btn",IMAGE_ASSET_PATH + "continue_button.png");

        game.load.image("btn_pause",IMAGE_ASSET_PATH + "pause_button.png");
        game.load.image("btn_play",IMAGE_ASSET_PATH + "play_button.png");
        
        game.load.image("test_reward_screen",IMAGE_ASSET_PATH + "reward_screen_all.png");

        game.load.spritesheet("test_skill",IMAGE_ASSET_PATH + "test_skill.png",132,112,8);
        game.load.spritesheet("test_attack",IMAGE_ASSET_PATH + "test_attack.png",160,128,3)

        game.load.spritesheet("attack_sword",IMAGE_ASSET_PATH + "attack_sword.png",712,108,4);
        game.load.spritesheet("attack_spear",IMAGE_ASSET_PATH + "attack_spear.png",632,140,4);
        game.load.spritesheet("attack_club",IMAGE_ASSET_PATH + "attack_club.png",744,232,4);
        
        game.load.spritesheet("btn_shield",IMAGE_ASSET_PATH + "round_button.png",332,332,2);
        game.load.image("icon_shield",IMAGE_ASSET_PATH + "icon_shield.png");
        game.load.spritesheet("btn_shield_load",IMAGE_ASSET_PATH + "shield_loading.png",332,332,65);
        game.load.image("screen_crack",IMAGE_ASSET_PATH + "screen_crack.png");

        game.load.spritesheet("shield_shine",IMAGE_ASSET_PATH + "shield_shine.png",170,170,8);
        game.load.image("shield_overlay",IMAGE_ASSET_PATH + "shield_overlay.png");
        game.load.spritesheet("shield_overlay_sheet",IMAGE_ASSET_PATH + "shield_overlay_states.png",256,236,4);

        game.load.image("btn_shield_perfect",IMAGE_ASSET_PATH + "shield_perfect_ribbon.png");
        
        //Battle Text
        game.load.spritesheet("battle_text_parry",IMAGE_ASSET_PATH + "parry_text.png",279,126,19);
        game.load.spritesheet("battle_text_break",IMAGE_ASSET_PATH + "break_text.png",896,204,7);
        game.load.spritesheet("bar_parry_3_slot", IMAGE_ASSET_PATH + "parry_3_slot.png",604,166,23);

        //SKILL_ICON
        game.load.image("icon_sword",IMAGE_ASSET_PATH + "sword_icon.png");
        game.load.image("icon_club",IMAGE_ASSET_PATH + "icon_club.png");
        game.load.image("icon_spear",IMAGE_ASSET_PATH + "icon_spear.png");

        game.load.image("icon_fire",IMAGE_ASSET_PATH + "fireball_icon.png");
        game.load.image("icon_parry",IMAGE_ASSET_PATH + "icon_parry.png");

        game.load.spritesheet("icon_scroll",IMAGE_ASSET_PATH + "scroll_menu_item.png",720,588,12);
        game.load.image("icon_dagger",IMAGE_ASSET_PATH + "dagger_icon.png");

        game.load.spritesheet("menu_btns_temp",IMAGE_ASSET_PATH + "menu_buttons_temp.png",544,200,4);
        game.load.spritesheet("menu_btns_blank",IMAGE_ASSET_PATH + "menu_button_blank.png",378,139,2);

        game.load.spritesheet("ui_icons_temp",IMAGE_ASSET_PATH + "temp_UI_icons.png",100,100,4);
    },
        
    create: function() {

       game.state.start("mainMenu");
       //game.state.start("reward",true,false,{gold:50, exp: 100, win: true});
    }
    
}