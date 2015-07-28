PrinceJS.Utils = {
 
    
    convertX: function (x) {

        return Math.floor(x * 320 / 140);
    
    },
    
    convertXtoBlockX: function( x ) {

        return Math.floor( ( x - 7 ) / 14 );
    
    },

    convertYtoBlockY: function( y ) {

        return Math.floor( y / PrinceJS.BLOCK_HEIGHT );
    
    },

    convertBlockXtoX: function( block ) {

        return block * 14 + 7;
    
    },

    convertBlockYtoY: function( block ) {

        return ( block + 1 ) * PrinceJS.BLOCK_HEIGHT - 10;
    
    }
    
    
}