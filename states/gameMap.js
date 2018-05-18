var gameMapState = {
    init : function() {
        
    },
    create : function() {
        var mapBg = game.add.sprite(0,0,"map_bg");

        var coliseumButton = game.add.sprite(0,0,"coliseum");
        //addHoverEffect(coliseumButton);
        coliseumButton.inputEnabled = true;
        coliseumButton.events.onInputUp.add(function(from,pointer,isOn) {
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
    },
    update : function() {

    }
}