const { readdir, readdirSync } = require( "fs" );

/*
    pollReadDir()
    readPath: path that is read
    seconds: number of seconds for delay
    repetition: times of repetition and then stop
    callback: callback to call back the result
*/
function pollReadDir( readPath, seconds, repetition, callback ){
    const validFormat = [ ".mp4", ".avi", ".mpeg", ".flv", ".mkv" ];

    const intervalId =
    setInterval(function(){
        
        // run N times and exit
        if( --repetition === 0 ){
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
        callback( validFile );
    }, seconds * 1000 )
}

module.exports = {
    pollReadDir
};
