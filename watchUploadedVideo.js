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

const findAddedVideos = (totalItems, oldItems) => {
    return totalItems.filter(function( item ){
        return !oldItems.some(function( video ){
            return video === item
        });
    });
};

const makeNewRecord = (totalVideos) => {
    return ((name, index) => {
        index = index + totalVideos + 1;
        return {
            id: index,
            filename: name,
            m3u8: false
        };
    })
};

pollReadDir( filesPath, 2, null, ( list ) => {

    const intervalDate = new Date().toString();
    log( "POLL:", intervalDate );

    let alreadyVideos =
    db.map(function( record ){
        return record.filename;
    });

    const addedVideos = findAddedVideos(list, alreadyVideos);

    // if there is nothing too add do nothing
    if( !addedVideos.length ) return;

    // should be inserted to database
    const totalVideos = alreadyVideos.length;
    const newRecordMaker = makeNewRecord(totalVideos);
    const newRecords = addedVideos.map(newRecordMaker);

    // insert to database
    newRecords.forEach(( newRecord ) => {
        db.push( newRecord );
    });

    log( `WRITE: ${newRecords.length} records(s) to ${dbName}` );
    writeToDatabase( APP_ROOT + dbPath, dbName, db );
});
