import {fdb} from "@/services/firebase.ts";
import {ref as dbRef,get as dbGet,set as dbSet,push as dbPush,onChildAdded,onChildChanged,onChildRemoved,child as dbChild} from "firebase/database";
import {CutSheet, Sheet} from "@/types/Types.ts";
import {useSheetStore} from "@store/sheetStore.ts";
const getSheets = async () => {
    const sheetsRef = dbRef(fdb, 'sheets');
    const snapshot = await dbGet(sheetsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return [];
    }
}

const getSheet = async (sheetID: number) => {
    const snapshot = await fdb.ref('sheets/' + sheetID).get();
    return snapshot.val();
}

const getSheetByCutSheetID = async (cutSheetID: number) => {
    const ref = await dbRef(fdb, 'sheets');
    const snapshot = await dbGet(ref);
    let sheets = snapshot.val();
    for (let sheet of sheets) {
        for (let cutSheet of sheet.cutSheets) {
            if (cutSheet.cutSheetID === cutSheetID) {
                return sheet;
            }
        }
    }

}

const addSheet = async (sheet: Sheet) => {
    const ref =  dbRef(fdb, 'sheets/');
    for (let i=0;i<sheet.count;i++) {
        const sheetID = sheet.sheetID + '_' + i;
        await dbSet(dbChild(ref, sheetID), {
            sheetID: sheetID,
            thickness: sheet.thickness,
            width: sheet.width,
            length: sheet.length,
            parentSheetID: sheet.sheetID,
            filled: false,
        });
    }
}

const editSheet = async (sheet: Sheet) => {
    const ref =  dbRef(fdb, 'sheets/' + sheet.sheetID);
    await dbSet(ref, sheet);
}

const deleteSheet = async (sheetID: number) => {
    const ref =  dbRef(fdb, 'sheets/' + sheetID);
    await dbSet(ref, null);
}

const addSheetHooks = () => {
    const sheetStore = useSheetStore();
    const sheetsRef = dbRef(fdb, 'sheets');
    onChildAdded(sheetsRef, (snapshot) => {
        sheetStore.sheets[snapshot.key] = snapshot.val();
        // update the cutSheets
        if (snapshot.val().cutSheets){
            const cutSheets:CutSheet[] = Object.values(snapshot.val().cutSheets);
            for (let cutSheet of cutSheets) {
                sheetStore.cutSheets[cutSheet.cutSheetID.toString()] = cutSheet;
            }
        }
    })
    onChildChanged(sheetsRef, (snapshot) => {
        sheetStore.sheets[snapshot.key] = snapshot.val();
        // update the cutSheets
        if (snapshot.val().cutSheets){
            const cutSheets:CutSheet[] = Object.values(snapshot.val().cutSheets);
            for (let cutSheet of cutSheets) {
                sheetStore.cutSheets[cutSheet.cutSheetID.toString()] = cutSheet;
            }
        }
    })
    onChildRemoved(sheetsRef, (snapshot) => {
        delete sheetStore.sheets[snapshot.key];
        // update the cutSheets
        if (snapshot.val().cutSheets){
            const cutSheets:CutSheet[] = Object.values(snapshot.val().cutSheets);
            for (let cutSheet of cutSheets) {
                delete sheetStore.cutSheets[cutSheet.cutSheetID.toString()];
            }
        }
    })
}

const addBalanceSheet = async (sheetID:string,balanceSheets:Sheet[]) =>{
    const ref =  dbRef(fdb, 'sheets/' + sheetID + '/balanceSheets');

    for (let balanceSheet of balanceSheets){
        const childRef = dbChild(ref,balanceSheet.bSheetID);
        await dbSet(childRef,balanceSheet);
    }
}
const deleteBalanceSheet = async (sheetID:string,bSheetID:string) =>{
    let ref =  dbRef(fdb, 'sheets/' + sheetID + '/balanceSheets/' + bSheetID);
    await dbSet(ref,null);
    ref =  dbRef(fdb, 'sheets/' + sheetID );
    const snapshot = await dbGet(ref);
    const sheet = snapshot.val();
    if (sheet.balanceSheets === undefined){
        await dbSet(dbChild(ref,'filled'),true);
    }
}
const addCutSheet = async (sheetID:string,cutSheets:CutSheet) =>{
    const ref =  dbRef(fdb, 'sheets/' + sheetID + '/cutSheets/'+cutSheets.cutSheetID);
    await dbSet(ref,cutSheets);

}

const deleteCutSheet = async (sheetID:string,cutSheetID:string) =>{
    const ref =  dbRef(fdb, 'sheets/' + sheetID + '/cutSheets/'+cutSheetID);
    await dbSet(ref,null);
}


export {getSheets,deleteBalanceSheet, getSheet, getSheetByCutSheetID, addCutSheet,addSheet, editSheet, deleteSheet,addSheetHooks,addBalanceSheet,deleteCutSheet};