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

}