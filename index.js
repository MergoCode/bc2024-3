 const { program } = require('commander');
 const fs  =  require('fs');
 const path = require('path');
 
 program
    .requiredOption('-i, --input <path>', 'Шлях до файлу вводу(обов`язковий)')
    .option('-o, --output <path>',  "Шлях до файлу виводу(необов'язковий)")
    .option('-d, --display', "Виведення результату в консоль");

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
    console.error("Please, specify input file");
    process.exit(1);
}

if (!fs.existsSync(options.input)){
    console.error("Cannot find the input file");
    process.exit(1);
}

const inputFilePath = path.resolve(options.input);
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

let parsedData;
try {
    parsedData = JSON.parse(fileContent);
} catch (err) {
    console.error("Input file is not a valid JSON");
    process.exit(1);
}

const result = JSON.stringify(parsedData, null, 2);



if (options.display) {
    console.log(result);
}

if (options.output) {
    const outputFilePath = path.resolve(options.output);
    fs.writeFileSync(outputFilePath, result, 'utf-8');

}

