const { readFileSync, writeFile } = require( "fs" );

const log = console.log.bind( console );
const sfy = JSON.stringify.bind( JSON );
const parse = JSON.parse.bind( JSON );

const dbPath = "/db";
const dbName = "uploaded-videos.json";

function readDatabase( path, file ){
    try{
        const db = readFileSync( `${path}/${file}`, "utf8" );
        if( db.length === 0 ){
            return [];
        }
        return parse( db );
    } catch( exception ){
        log( "exception:", exception );
    }
}

function writeToDatabase( path, file, data ){
    writeFile( `${path}/${file}`, sfy( data ), function( error ){
        if( error ){
            log( "exception:", error );
        }
    });
}

module.exports = {
    readDatabase,
    writeToDatabase,
    dbPath,
    dbName
};
