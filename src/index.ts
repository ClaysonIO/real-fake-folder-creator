import * as fs from 'fs';
import * as faker from 'faker';
import * as path from 'path';
import { Document, Packer, Paragraph, TextRun } from "docx";


const baseFolderName: string = "output";
const folderBreadth: number | [number, number] = 3;
const folderDepth: number | [number, number] = [2,4];
const fileCount: number | [number, number] = [2,3];
const fileTypes: ("pdf" | "docx" | "xlsx")[] = ["docx"];

createChildFolders({folderBreadth, folderDepth, fileCount, fileTypes, folderPath: baseFolderName})

function getFolderName(){
    return faker.fake("{{vehicle.vehicle}}")
}

function getNumber(num: number | [number, number]){
    return Array.isArray(num) ? faker.datatype.number({
        min: Math.min(...num),
        max: Math.max(...num),
    }) : num;
}

function decreaseDepth(num: number | [number, number]): number | [number, number]{
    return Array.isArray(num) ? num.map(x=>(x-1) > 0 ? (x-1) : 0) as [number, number] : num -1;
}

async function  createChildFolders({folderBreadth, folderDepth, folderPath, fileCount, fileTypes}: {folderBreadth: number | [number, number], folderDepth: number | [number, number], folderPath: string, fileCount: number | [number, number], fileTypes: ("pdf" | "docx" | "xlsx")[]}){
    //Make sure we're starting with an empty folder
    try{
        fs.rmdirSync(folderPath, {recursive: true});
    } catch(e){
    }
    fs.mkdirSync(folderPath)

    //Create child folders, and rerun this function on each
    const currentFolderBreadth = getNumber(folderBreadth);
    for(let i = 0; i < currentFolderBreadth; i++){
        const currentDepth = getNumber(folderDepth);

        const newFolderName = getFolderName();
        const newPath = path.join(folderPath, newFolderName);
        const newDepth = decreaseDepth(folderDepth);

        if(currentDepth > 0){
            await createChildFolders({folderBreadth, folderDepth: newDepth, folderPath: newPath, fileCount, fileTypes});
        }
    }

    //Create files in folder
    const currentFiles = getNumber(fileCount);

    for(let e=0; e < currentFiles; e++){
        const fileType = faker.random.arrayElement(fileTypes);

        switch(fileType){
            case "docx": createRandomDocx(folderPath); break;
            case "xlsx": createRandomXlsx(folderPath); break;
            case "pdf": createRandomPdf(folderPath); break;
        }
    }
}

function createRandomDocx(folderPath: string){

    const paragraphs = [];

    const count = getNumber([2,10]);
    for(let e = 0; e < count; e++){
        paragraphs.push(new Paragraph({
            children: [new TextRun(faker.lorem.paragraph(faker.datatype.number({min: 2, max: 10})))]
        }))
    }


    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs
        }]
    })

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(path.join(folderPath, `${faker.system.fileName()}.docx`), buffer);
    });
}
function createRandomXlsx(folderPath: string){

}
function createRandomPdf(folderPath: string){

}