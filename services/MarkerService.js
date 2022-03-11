import * as SQLite from 'expo-sqlite'

class MarkerService {

    getDBConnection = async () => {
        return SQLite.openDatabase('testDb.db')
    }

    createTables = async(db) => {
        console.log("Создание")
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL)'
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT)'
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS markerImages (id INTEGER PRIMARY KEY AUTOINCREMENT, marker_id INT, image_uri TEXT)'
            );
        })
    }

    addMarker = async(db, name, latitude, longitude) => {
        console.log("Добавление")
        console.log("db: ", db)
        db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO markers (name, latitude, longitude) values (?, ?, ?)", [name, latitude, longitude]
            );
            tx.executeSql("select * from markers", [], (_, { rows }) =>
                console.log("markers: ", JSON.stringify(rows))
            );
        })
    }

    getMarkers = async (db) => {
        return new Promise((resolve, reject) => {
            let listMarkers = {}
            db.transaction(tx => {
                tx.executeSql("select * from markers", [], (_, { rows }) => {
                    console.log("LEN: ", rows.length)
                    rows._array.forEach((elem, index) => {
                        console.log("ind: ", index, "  elem: ", elem)
                        let marker = {
                        latitude: elem.latitude,
                        longitude: elem.longitude,
                        name: elem.name,
                        id: elem.id
                        }
                        //setMarkerCoords({...markerCoords, [index]:marker})
                        listMarkers = {...listMarkers, [index]:marker}
                    });
                    console.log("listMark: ", listMarkers)
                    resolve(listMarkers)
                });
            })
        })
    }
}

export default MarkerService