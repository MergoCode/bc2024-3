const { program } = require('commander');
const fs = require('fs');
const path = require('path');


program.configureOutput({
    outputError: (str, write) => {
      if (str.includes("option '-i, --input <path>' argument missing")) {
        write("Please, specify input file");
      } else {
        write(str);
      }
    },
  });

program
    .requiredOption('-i, --input <path>', 'Шлях до файлу вводу (обов`язковий)')
    .option('-o, --output <path>', "Шлях до файлу виводу (необов`язковий)")
    .option('-d, --display', "Виведення результату в консоль");





program.parse(process.argv);


const options = program.opts();

if (!options.input) {
    console.error("Please, specify input file");
    process.exit(1);
}

if (!fs.existsSync(options.input)) {
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


const filteredData = parsedData.filter(field => field.value > 5 && field.ku > 13);

if (filteredData.length === 0) {
    console.warn("Не знайдено жодного об'єкта, що задовольняє умови фільтрації.");
}

const result = JSON.stringify(filteredData, null, 2);

if (options.display) {
    console.log("Відфільтровані дані:", result);
}

if (options.output) {
    const outputFilePath = path.resolve(options.output);
    fs.writeFileSync(outputFilePath, result, 'utf-8');
    console.log(`Фільтровані дані збережено у файл: ${outputFilePath}`);
}
