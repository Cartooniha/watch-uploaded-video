const { readdir, readdirSync } = require( "fs" );
const { basename } = require( "path" );

const { pollReadDir } = require( "./lm/readDirectory.js" );
const { readDatabase,
        writeToDatabase,
        dbPath,
        dbName } = require( "./lm/databaseManager.js" );

const APP_ROOT = __dirname;
const log = console.log.bind( console );
const filesPath = "/tmp";

const db = readDatabase( dbPath, dbName );

pollReadDir( filesPath, 2, null, function( list ){
    
    const intervalDate = new Date().toString();
    log( "POLL:", intervalDate );

    let videos =
    db.map(function( record ){
        return record.filename;
    });
    const videosMaxId = videos.length;

    const notInDb =
    list.filter(function( item ){
        return !videos.some(function( vidoe ){
            return vidoe === item
        });
    })

    // if not-in-db is empty do nothing
    if( !notInDb.length ) return;

    // should be inserted to database
    const newRecors =
    notInDb.map(function( name, index ){
        index = index + videosMaxId + 1;
        return {
            id: index,
            filename: name,
            m3u8: false
        };
    })

    // insert to database
    newRecors.forEach(function( nr ){
        db.push( nr );
    });

    log( `WRITE: ${newRecors.length} records(s) to ${dbName}` );
    writeToDatabase( dbPath, dbName, db );
});
