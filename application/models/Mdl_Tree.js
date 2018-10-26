const csv = require('csvtojson');
const fs = require('fs')
var Combinatorics = require('js-combinatorics');
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


exports.Homicides = async () => {

	return new Promise(async (resolve, reject) => {
		const data = await this.ReadExcel(csvFilePath);
		console.log(data);

		resolve(data);

	});
}
exports.TheTree = async (path, columns) => {

	return new Promise(async (resolve, reject) => {

		const data = await this.ReadCSV(path);
		//console.log(path, columns);
		//console.log(cmb.toArray());
		// this.Permutation(columns, columns.length)

		cmb = Combinatorics.permutation(columns);
		let perm = cmb.toArray();
		let trees = [];
		for (let index in perm) {
			trees.push(await this.Entropy(await this.Tree(perm[index], data)));
		}
		
		let bestTree = {
			entropy: 0,
			index: 0,
		};
		for (let index in trees) {
			let tree = await this.TotalEntropy(trees[index]);
			if (index == 0) {
				bestTree.entropy = tree;
			} else {
				if (tree < bestTree.entropy) {
					bestTree.entropy = tree;
					bestTree.index = index;
				}
			}

			console.log('Entropy tree', index, 'total:', tree);
		}
		// console.log( );
		bestTree.trees = trees;
		resolve( bestTree );
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

exports.Tree = (columns, data) => {
	return new Promise(async (resolve, reject) => {
		//console.log('Doing tree...');
		//console.log('Columns: ', columns);
		//console.log('First row: ', data[0]);
		let categories = [];
		for (let index in columns) {
			categories[index] = {
				name: columns[index],
				categories: await this.GetCategories(columns[index], data)
			};
		}
		resolve(this.Branch(categories, data));
	});
}

exports.Entropy = (tree) => {
	return new Promise(async (resolve, reject) => {
		//console.log(tree); 
		// let newTree = {
		// 	entropy: 0,
		// };
		for (let index in tree) {
			if (tree[index].cont > 0) {
				tree[index].entropy = -(tree[index].cont / tree[index].total) * Math.log10((tree[index].cont / tree[index].total));
			} else {
				tree[index].entropy = 0;
			}

			// newTree.entropy += tree[index].entropy;

			if (tree[index].branches) {
				tree[index].branches = await this.Entropy(tree[index].branches);
				// newTree.entropy += ntree.entropy;
				//  = ntree.tree;
			}
		}
		// console.log( newTree.entropy );
		// newTree.entropy = Math.abs(newTree.entropy);
		// newTree.tree = tree;
		resolve(tree);
	});
}

exports.TotalEntropy = (tree) => {

	return new Promise(async (resolve, reject) => {
		let total = 0;
		for (let index in tree) {
			if (tree[index].entropy != null) {
				//console.log( tree[index].entropy );
				total += tree[index].entropy;
				if (tree[index].branches) {
					total += await this.TotalEntropy(tree[index].branches);
				}
			}
		}
		//console.log( 'Entropy Total', total);
		resolve(total);
	});

}


exports.GetCategories = (column, data) => {
	return new Promise(async (resolve, reject) => {
		let list = [];
		for (let index in data) {
			if (!list.includes(data[index][column])) {
				list.push(data[index][column]);
			}
		}
		resolve(list)
	})
}
exports.Branch = (branches, data) => {
	return new Promise(async (resolve, reject) => {
		let branch = {};
		let newData;

		for (let index in branches[0].categories) {
			branch[branches[0].categories[index]] = {
				name: branches[0].categories[index],
				cont: 0,
				total: data.length,
			}
			newData = [];

			for (let id in data) {

				if (data[id][branches[0].name] == branches[0].categories[index]) {
					//console.log('equal');
					branch[branches[0].categories[index]].cont++;
					newData.push(data[id]);
				}
			}
			if (branches.length > 1) {

				branch[branches[0].categories[index]].branches = await this.Branch(branches.slice(1), newData);
			}
		}

		resolve(branch);
	});
}