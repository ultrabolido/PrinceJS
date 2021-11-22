import { BLOCK_HEIGHT } from './Config';

export function convertX(x) {

    return Math.floor(x * 320 / 140);
    
}
    
export function convertXtoBlockX( x ) {

    return Math.floor( ( x - 7 ) / 14 );
    
}

export function convertYtoBlockY( y ) {

        return Math.floor( y / BLOCK_HEIGHT );
    
}

export function convertBlockXtoX( block ) {

        return block * 14 + 7;
    
}

export function convertBlockYtoY( block ) {

        return ( block + 1 ) * BLOCK_HEIGHT - 10;
    
}

export function distanceToEdgeFromX( x ) {

        let block = convertXtoBlockX(x);
        let edge = convertBlockXtoX(block);
        console.log("Distance to edge from X" + (x-edge));
        return x - edge;

}