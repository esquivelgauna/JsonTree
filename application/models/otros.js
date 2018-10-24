


exports.Filter = (from, to, path) => {

	return new Promise(async (resolve, reject) => {
		// const csvFilePath = './Temp/Log.csv';
		csv().fromFile(path).then(async (jsonObj) => {

			console.log(Object.keys(jsonObj[0]));
			console.log(jsonObj[0]);
			let data = [];
			await jsonObj.map((row) => {
				if (row.ID >= from && row.ID <= to) {
					data[row.ID] = row;
				}
			});
			// for( let i = from ; i >= to ; i++ ){
			// 	 data[i] = await jsonObj[i-1];
			// }
			console.log(data.length);
			let fields = Object.keys(jsonObj[0])
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

	return new Promise(async (resolve, reject) => {
		csv().fromFile(path).then(async (jsonObj) => {
			console.log(Object.keys(jsonObj[0]));
			let data = [];
			await jsonObj.map((row) => {
				//Gender
				if (row['VicGen'] == row['SusGen']) {
					row['Gender'] = 'SAME';
				} else {
					row['Gender'] = 'DIF';
				}
				//Race
				if (row['VicRac'] == row['SusRac']) {
					row['Race'] = 'SAME';
				} else {
					row['Race'] = 'DIF';
				}
				data[row.ID] = row;
			});
			console.log(data.length);
			let fields = Object.keys(jsonObj[0])
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
exports.Permutation = (columns) => {
	let list = {};
	for (let x in columns) {
		list[x] = []
		list[x].push(columns[x])
		for (let y in columns) {
			list[x]
		}
	}
	columns.length

}
