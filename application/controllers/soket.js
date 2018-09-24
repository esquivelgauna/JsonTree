module.exports = function (server) {
	var io = require('socket.io')(server);
	var model = require('../models/Mdl_Tree');


	io.on('connection', function (socket) {
		console.log('New user connected by WebSockets \n');
		socket.on('GetTree', (data) => {
			console.log(data); 
			model.Excel((tree) => {
				socket.emit('SetTree',tree);
			});
		});

		socket.on('Hello', (data) => {
			console.log(data);
		});


		socket.on('disconnect', () => {});
	});
	return io;
};

// nodeStructure: {
// 	text: {
// 		name: "Crimenes"
// 	},
// 	children: [{
// 			text: {
// 				name: "Same race ",
// 			},
// 			children: [{
// 				text: {
// 					name: "Same Gender "
// 				},
// 				children: [{
// 						text: {
// 							name: 'Private Place'
// 						},
// 						children: [{
// 								text: {
// 									name: 'Type Gun'
// 								},
// 								children: [{
// 										text: {
// 											name: 'Explosives'
// 										}
// 									},
// 									{
// 										text: {
// 											name: 'fire guns'
// 										}
// 									},
// 									{
// 										text: {
// 											name: 'quimics'
// 										}
// 									}
// 								]
// 							},

// 						]
// 					},
// 					{
// 						text: {
// 							name: 'Public Place'
// 						}
// 					}
// 				]
// 			}, {
// 				text: {
// 					name: 'Difrent Gender'
// 				},
// 				children: [{
// 						text: {
// 							name: 'Private Place'
// 						}
// 					},
// 					{
// 						text: {
// 							name: 'Public Place'
// 						}
// 					}
// 				]
// 			}]

// 		},
// 		{
// 			text: {
// 				name: "Difrent race ",
// 			},
// 			children: [{
// 				text: {
// 					name: "Same Gender "
// 				},
// 				children: [{
// 					text: {
// 						name: 'Private Place'
// 					},
// 					text: {
// 						name: 'Public Place'
// 					}
// 				}]
// 			}, {
// 				text: {
// 					name: 'Difrent Gender'
// 				},
// 				children: [{
// 					text: {
// 						name: 'Private Place'
// 					},
// 					children: [{
// 						text: {
// 							name: 'Gun Type'
// 						},
// 						children: [{
// 							text: {
// 								name: 'Explosives'
// 							},
// 							text: {
// 								name: 'Fire Guns'
// 							}
// 						}]
// 					}],
// 					text: {
// 						name: 'Public Place'
// 					}
// 				}]
// 			}]
// 		}
// 	]
// }