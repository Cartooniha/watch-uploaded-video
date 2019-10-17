const { readdir, readdirSync } = require( "fs" );
const { basename } = require( "path" );

const { env } = require( "./user_modules/readConfigFile.js" );
const { pollReadDir } = require( "./user_modules/readDirectory.js" );
const { readDatabase,
        writeToDatabase,
        dbPath,
        dbName } = require( "./user_modules/databaseManager.js" );

const APP_ROOT = __dirname;
const log = console.log.bind( console );
const filesPath = env.UPLOAD_DIR;

const db = readDatabase( APP_ROOT + dbPath, dbName );

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
    writeToDatabase( APP_ROOT + dbPath, dbName, db );
});
