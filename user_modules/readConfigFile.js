const { readFileSync } = require( "fs" );

const parse = JSON.parse.bind( JSON );
const log   = console.log.bind( console );
const keys  = Object.keys.bind( Object );

function removeBasename( path ){
    const array = path.split( "/" );
    array.pop();
    return array.join( "/" );
}

function difference( first, second ){
    return first.filter(function( f ){
        return second.every(function( s ){
            return f !== s
        });
    });
} 

const dotenvPath = removeBasename( __dirname );
const dotenvName = ".env";

const dotenv = (function(){
    try{
        return parse( readFileSync( `${dotenvPath}/${dotenvName}`, "utf8" ) );
    } catch( exception ){
        log( "exception:", exception );
        process.exit( 0 );
    }
}());

const dotenvKeys = keys( dotenv );
const processEnvkeys = keys( process.env );

const diff = difference( dotenvKeys, processEnvkeys );

diff.forEach(function( key ){
    process.env[ key ] = dotenv[ key ];
});

const env = { ...process.env };
module.exports = { env };
