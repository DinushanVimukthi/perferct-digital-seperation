import {defineStore} from "pinia"
import {CutSheet, Sheet} from "../types/Types.ts";
import {
    addBalanceSheet,
    addCutSheet,
    addSheet,
    deleteBalanceSheet, deleteCutSheet,
    deleteSheet,
    editSheet,
    getSheets
} from "../services/sheetServices.ts";


export const useSheetStore = defineStore('sheetStore', {
    state: () => ({
        sheets: {} as Record<string, Sheet>,
        cutSheets: {} as Record<string, CutSheet>,
    }),
    getters: {
        getAllSheets(): any{
            return this.sheets;
        },
        getLastSheetID(): string {
            const keys = Object.keys(this.sheets);
            if (keys.length === 0) {
                return 'S0';
            } else {
                return "S" + (parseInt(keys[keys.length - 1].substring(1)) + 1).toString();
            }
        },
        getAllSheetsForJobs(): any {
            const sheets:Record<string, Sheet> = this.sheets;
            const sheetArray = [];
            let i = 0;
            const values = Object.values(sheets);
            for (const sheet of values) {
                sheetArray[i++] = {
                    sheetID: sheet.sheetID,
                    thickness: sheet.thickness,
                    width: sheet.width,
                    length: sheet.length,
                    selected:false
                }
            }
            return sheetArray;
        },
        getSheet: (state) => (sheetID: string) => {
            console.log(sheetID)
            const values:Sheet[] = Object.values(state.sheets);
            const sheet = values.find((sheet: Sheet) => sheet.sheetID === sheetID);
            return sheet;
        },
        getThicknessOfSheets(): any {
            const sheets = this.sheets;
            const thicknessArray = [];
            let i = 0;
            const values = Object.values(sheets);
            for (const sheet of values) {

                thicknessArray[i++] = {
                    label : sheet.thickness.toString(),
                    value: sheet.thickness,
                    disabled:false,
                }
            }
            // Remove duplicates
            return thicknessArray.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.value === thing.value
                    ))
            );
        },
        getBalanceSheet(): any {
            const sheets = this.sheets;
            const balanceSheetArray = [];
            let i = 0;
            const values:Sheet[] = Object.values(sheets);
            for (const sheet of values) {
                if(!sheet.filled){
                    if (sheet.balanceSheets){
                        for (let bSheet in sheet.balanceSheets){
                            balanceSheetArray[i++] = {
                                sheetID: sheet.sheetID,
                                thickness: sheet.thickness,
                                width: sheet.balanceSheets[bSheet].width,
                                length: sheet.balanceSheets[bSheet].length,
                                bSheetID: sheet.balanceSheets[bSheet].bSheetID,
                            }
                        }
                    }else {
                        balanceSheetArray[i++] = {
                            sheetID: sheet.sheetID,
                            thickness: sheet.thickness,
                            width: sheet.width,
                            length: sheet.length,
                            bSheetID: '',
                        }
                    }
                }
            }
            return balanceSheetArray;
        },
        getAllCutSheets(): any{
            return this.cutSheets;
        },
        getCutSheet: (state) => (jobID: string) => {
            const values:CutSheet[] = Object.values(state.cutSheets);
            const cutSheet = values.find((cutSheet: CutSheet) => cutSheet.jobID === jobID);
            return cutSheet;
        },
        getCutSheetParentWidth: (state) => (jobID: string) => {
            const values:CutSheet[] = Object.values(state.cutSheets);
            const cutSheet = values.find((cutSheet: CutSheet) => cutSheet.jobID === jobID);
            return cutSheet?.parentWidth;
        },
        getCutSheetParentLength: (state) => (jobID: string) => {
            const values:CutSheet[] = Object.values(state.cutSheets);
            const cutSheet = values.find((cutSheet: CutSheet) => cutSheet.jobID === jobID);
            return cutSheet?.parentLength;
        }

    },
    actions: {
        async addSheet(sheet: Sheet) {
            await addSheet(sheet);
        },
        async InitializeSheets() {
            this.sheets = await getSheets();
            const values:Sheet[] = Object.values(this.sheets);
            for (let value of values) {
                if (value.cutSheets){
                    const cutSheets:CutSheet[] = Object.values(value.cutSheets);
                    for (let cutSheet of cutSheets) {
                        this.cutSheets[cutSheet.cutSheetID.toString()] = cutSheet;
                    }
                }
            }
        },
        async editSheet(sheet: Sheet) {
            await editSheet(sheet);
        },
        async deleteSheet(sheetID: string) {
            await deleteSheet(sheetID);
        },
        async addBalanceSheet(sheetID:string,balanceSheet: Sheet[]) {
            await addBalanceSheet(sheetID,balanceSheet)
        },
        async addCutSheet(sheetID:string,cutSheet: Sheet) {
            await addCutSheet(sheetID,cutSheet)
        },
        async deleteBalanceSheet(sheetID:string,bSheetID:string) {
            await deleteBalanceSheet(sheetID,bSheetID)
        },
        async deleteCutSheet(sheetID:string,cutSheetID:string) {
            await deleteCutSheet(sheetID,cutSheetID)
        }

    }
})






