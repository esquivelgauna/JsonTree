const csv = require('csvtojson');
const fs = require('fs')
const Json2csvParser = require('json2csv').Parser;

const csvFilePath = './Temp/Log.csv';
const guns = './Temp/guns.csv';
const sit = './Temp/sit.csv';

exports.Excel = (callback) => {
	console.log("Iniciando el procesado");
	csv().fromFile(csvFilePath).then((jsonObj) => {
		console.log("Lectura teminada..")
		this.Guns((gunsList) => {
			this.DoTree1(jsonObj, gunsList, (tree) => {
				callback(tree);
			});
		});
	});
}

exports.DoTree1 = (cases, gunsList, callback) => {
	// VICTIM: 'Blac steward',
	// VicRac: '3',
	// VicGen: '1',
	// AGE: '',
	// SUSPECT: 'Wilson, Wm',
	// SusRac: '1',
	// SusGen: '1',
	// SAGE: '',
	let length = Object.keys(cases).length;
	let cont = 0;
	let tree = {};
	var race, gender, place, gunType = null;
	for (let index in cases) {
		(((jIndex) => {
			cont++;
			//Race 
			if (cases[jIndex]["VicRac"] == cases[jIndex]["SusRac"]) {
				race = 'Same Race';
			} else {
				race = 'Different Race';
			}
			//Gender
			if (cases[jIndex]["VicGen"] == cases[jIndex]["SusGen"]) {
				gender = 'Same Gender';

			} else {
				gender = 'Different Gender';
			}
			//Clasification
			//CLASSIFICATION
			if (cases[jIndex]["SITUATION ID"] == "") {
				place = 'Unclassified';
			} else {
				place = cases[jIndex]["SITUATION ID"];
			}
			//Gun Type 
			if (gunsList[cases[jIndex]["WEAPON ID"]]) {
				gunType = cases[jIndex]["WEAPON ID"];
			} else {
				gunType = "NC";
			}

			//////TREE
			//Race
			if (!tree[race]) {
				tree[race] = {
					length: 1
				}
			} else {
				tree[race].length = tree[race].length + 1;
			}
			//Gender
			if (!tree[race][gender]) {
				tree[race][gender] = {
					length: 1
				}
			} else {
				tree[race][gender].length = tree[race][gender].length + 1;
			}
			//Place
			if (!tree[race][gender][place]) {
				tree[race][gender][place] = {
					length: 1
				}
			} else {
				tree[race][gender][place].length = tree[race][gender][place].length + 1;
			}
			//GUN
			if (!tree[race][gender][place][gunType]) {
				tree[race][gender][place][gunType] = {
					length: 1
				}
			} else {
				tree[race][gender][place][gunType].length = tree[race][gender][place][gunType].length + 1;
			}
			//Gender
			if (cont == length) {
				//console.log('same gender:', tree.difRace.sameGender, 'Difrent gender:', Object.keys(difGender).length);
				console.log('Finish ..', tree);
				callback(tree);
			}
		})(index));
	}
}
  
exports.Guns = (callback) => {
	let gunsList = {};
	csv().fromFile(guns).then((jsonObj) => {
		let length = jsonObj.length;
		let cont = 0;
		//console.log( 'Armas',  jsonObj );
		for (let index in jsonObj) {
			cont++;
			(((jindex) => {
				gunsList[jsonObj[jindex]['WEAPON ID']] = jsonObj[jindex]['WEAPON TYPE'];
				if (cont == length) {
					console.log('Armas', gunsList);
					callback(gunsList);
				}
			})(index))
		}
	});
}

exports.Sit = (callback) => {
	let sitList = {};
	csv().fromFile(sit).then((jsonObj) => {
		let length = jsonObj.length;
		let cont = 0;
		for (let index in jsonObj) {
			cont++;
			(((jindex) => {
				sitList[jsonObj[jindex]['Situaciones']] = jsonObj[jindex]['Let'];
				if (cont == length) {
					console.log(sitList);
					callback(sitList);
				}
			})(index))
		}
	});
}

exports.Homicides = async () => {

	return new Promise(async (resolve, reject) => {
		const data = await this.ReadExcel(csvFilePath);
		console.log(data);

		resolve(data);

	});
}
exports.Autos = async ( path , columns ) => {

	return new Promise(async (resolve, reject) => {
		
		//const data = await this.ReadCSV(path);
		console.log( path , columns );

		resolve(true);

	});
}

exports.ReadCSV = (csvName) => {
	return new Promise(async (resolve, reject) => {
		resolve
		csv().fromFile(csvName).then((data) => {
			resolve(data)
		}, (err) => {
			reject(err)
		});
	});
}

exports.Entropy = (tree) => {

}
exports.Conbiner =( columns )=>{
	let list = {};
	columns.length

}









exports.Filter = (from, to, path) => {

	return new Promise( async (resolve, reject) => {
		// const csvFilePath = './Temp/Log.csv';
		csv().fromFile(path).then( async (jsonObj) => {

			console.log( Object.keys( jsonObj[0] ) );
			console.log( jsonObj[0] );
			let data = [];
			await jsonObj.map(( row )=>{
				if( row.ID >= from && row.ID <= to ) {
					data[ row.ID ] = row;
				}
			});
			// for( let i = from ; i >= to ; i++ ){
			// 	 data[i] = await jsonObj[i-1];
			// }
			console.log(data.length);
			let fields = Object.keys( jsonObj[0] )
			let csvInit = new Json2csvParser({
				fields
			});
			const csv = csvInit.parse(data);
			//console.log(csv);
			fs.writeFile('Filtro.csv', csv, 'utf8', function (err) {
				if (err) {
					console.log('Some error occured - file either not saved or corrupted file saved.');
				} else {
					console.log('It\'s saved!');
				}
			});

			resolve(jsonObj);
			
		})
	});

}
exports.Gender = (path) => {

	return new Promise( async (resolve, reject) => {
		csv().fromFile(path).then( async (jsonObj) => {
			console.log( Object.keys( jsonObj[0] ) ); 
			let data = [];
			await jsonObj.map(( row )=>{
				//Gender
				if( row['VicGen'] ==   row['SusGen'] ){
					row['Gender'] = 'SAME' ;
				}else{
					row['Gender'] = 'DIF' ;
				}
				//Race
				if( row['VicRac'] ==   row['SusRac'] ){
					row['Race'] = 'SAME' ;
				}else{
					row['Race'] = 'DIF' ;
				}
				data[ row.ID ] = row;
			}); 
			console.log(data.length);
			let fields = Object.keys( jsonObj[0] )
			let csvInit = new Json2csvParser({
				fields
			});
			const csv = csvInit.parse(data);
			fs.writeFile('Gender.csv', csv, 'utf8', function (err) {
				if (err) {
					console.log('Some error occured - file either not saved or corrupted file saved.');
				} else {
					console.log('It\'s saved!');
				}
			});

			resolve(jsonObj);
			
		})
	});

}
