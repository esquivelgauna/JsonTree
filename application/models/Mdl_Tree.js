const csv = require('csvtojson');
const csvFilePath = './Temp/Log.csv';
const guns = './Temp/guns.csv';
const sit = './Temp/sit.csv';

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
			if ( cases[jIndex]["SITUATION ID"] == "") {
				place = 'Unclassified';
			} else {
				place = cases[jIndex]["SITUATION ID"];
			}
			//Gun Type 
			if( gunsList[cases[jIndex]["WEAPON ID"]] ){
				gunType = cases[jIndex]["WEAPON ID"];
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
		//console.log( 'Armas',  jsonObj );
		for (let index in jsonObj) {
			cont++;
			(((jindex) => {
				gunsList[jsonObj[jindex]['WEAPON ID']] = jsonObj[jindex]['WEAPON TYPE'];
				if (cont == length) {
					console.log( 'Armas',  gunsList);
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