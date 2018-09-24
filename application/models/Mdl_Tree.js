const csvFilePath = './Temp/hom.csv'
const guns = './Temp/guns.csv'
const csv = require('csvtojson');

exports.Excel = (callback) => {
	console.log("Iniciando el procesado");
	csv().fromFile(csvFilePath).then((jsonObj) => {
		console.log("Lectura teminada..")
		this.Guns( (gunsList)=>{
			this.DoTree1(jsonObj, gunsList, (tree) => {
				callback(tree);
			});
		} );
		
	});
}
exports.DoTree = (cases, callback) => {
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
				race = 'Misma Raza';
			} else {
				race = 'Diferente Raza';
			}
			//Gender
			if (cases[jIndex]["VicGen"] == cases[jIndex]["SusGen"]) {
				gender = 'Mismo Genero';

			} else {
				gender = 'Diferente Genero';
			}
			//Place
			if (cases[jIndex]["Where"] == '1') {
				place = 'public';
			} else {
				place = 'private';
			}
			//Gun Type 
			switch (cases[jIndex]["Type"]) {
				case "1":
					gunType = 'Fire';
					break;
				case "2":
					gunType = 'Quimics';
					break;
				case "3":
					gunType = 'Fill';
					break;
				case "4":
					gunType = 'Hands';
					break;
				case "5":
					gunType = 'Explosive';
					break;
				default:
					gunType = 'Other';
					break;
			}
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

exports.DoTree1 = (cases,gunsList, callback) => {
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
				race = 'Misma Raza';
			} else {
				race = 'Diferente Raza';
			}
			//Gender
			if (cases[jIndex]["VicGen"] == cases[jIndex]["SusGen"]) {
				gender = 'Mismo Genero';

			} else {
				gender = 'Diferente Genero';
			}
			//Clasification
			//CLASSIFICATION
			if ( cases[jIndex]["CLASSIFICATION"] == "") {
				place = 'Unclassified';
			} else {
				place = cases[jIndex]["CLASSIFICATION"];
			}
			//Gun Type 
			if( gunsList[cases[jIndex]["WEAPON"]] ){
				gunType = gunsList[cases[jIndex]["WEAPON"]];
			}else{
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
		for (let index in jsonObj) {
			cont++;
			(((jindex) => {
				gunsList[jsonObj[jindex]['Armas registradas']] = jsonObj[jindex]['Let'];
				if (cont == length) {
					console.log(gunsList);
					callback(gunsList);
				}
			})(index))
		}
		//callback()
	});
}