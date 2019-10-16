const { readdir, readdirSync } = require( "fs" );

function pollReadDir( readPath, ms, n, cb ){
    const validFormat = [ ".mp4", ".avi", ".mpeg", ".flv", ".mkv" ];

    const intervalId =
    setInterval(function(){
        
        // run N times and exit
        if( --n === 0 ){
            clearInterval( intervalId );
        }

        // list of valid file that matches our valid format
        const validFile = 
        readdirSync( readPath ).filter(function( filename ){
            return validFormat.some(function( format ){
                return filename.endsWith( format );
            });
        })

        // tell the callback
        cb( validFile );
    }, ms )
}

module.exports = {
    pollReadDir
};
