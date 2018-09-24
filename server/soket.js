module.exports = function (server, session, sharedsession) {
	var io = require('socket.io')(server);
	var fs = require('fs');
	var mysql = require('./db');

	var usuarios = {};
	var sockets = {};

	io.use(sharedsession(session));

	io.on('connection', function (socket) {
		console.log('Alguien se ha conectado con Sockets');
		socket.on('login', function (data) {
			//console.log(data);
			mysql.select({
				table: 't_dat_online',
				conditions: {
					token: data.token
				},
				show_query: true
			}, (err, result) => {
				//if (err) throw err;
				//console.log(result);
				if (result.length != 0) {
					if (result[0].estatus) {
						if (usuarios[result[0]['f_id_usuario']] == undefined) {
							//console.log('Id: ' + result[0]['f_id_usuario']);
							usuarios[result[0]['f_id_usuario']] = {
								id: result[0]['f_id_usuario'],
								sid: socket.id,
								token: data.token
							}
							socket.handshake.session.userdata = result[0];
							socket.handshake.session.save();
							sockets[socket.id] = result[0]['f_id_usuario'];
							console.log('No registrtado');
						} else {
							usuarios[result[0]['f_id_usuario']].sid = socket.id;
							console.log('Ya regsitrado');
						}

						mysql.select({
							table: 'v_inbox2',
							conditions: {
								id_usuario: result[0]['f_id_usuario']
							},
							show_query: true
						}, function (err, result) {
							if (result.length != 0) {
								socket.emit('chats', result);
							}
						});

					}
				}
			});
		});

		socket.on('chat', (data) => {
			mysql.native_query({

				query: 'SELECT f_id_usuario AS id_usuario ,mensaje,fecha_msj FROM (SELECT * FROM t_dat_mensajes WHERE f_id_inbox = ' + data.id + ' ORDER BY id_mensaje DESC LIMIT 10) al ORDER BY id_mensaje ASC '

			}, (err, result) => {
				if (err) throw err;
				//console.log(result);
				if (result.length > 0) {
					socket.emit('chat', result);
				} else {
					socket.emit('chat', []);
				}
			});

		});

		socket.on('nuevoChat', (data) => {
			// console.log(data);
			mysql.select({
				table: 'v_inbox2',
				conditions: {
					id_usuario: sockets[socket.id],
					receptor: data.id
				},
				show_query: true
			}, function (err, result) {
				if (result.length != 0) {
					socket.emit('nuevoChat', result[0]);
				}
			});

		});

		socket.on('cont', (data) => {
			console.log('Reset contador ');
			console.log(data);
			mysql.select({
				table: 't_dat_inbox',
				conditions: {
					id_inbox: data.id_inbox
				},
				show_query: true
			}, function (err, result) {

				if (result[0]["f_id_usuario_a"] == sockets[socket.id]) {
					mysql.update({
							table: 't_dat_inbox',
							details: {
								sin_leer_a: 0,
								estatus: '0'
							},
							conditions: {
								id_inbox: result[0]["id_inbox"]
							},
							show_query: true
						},
						function (err, result, number_of_changed_rows) {}
					);
				} else {
					mysql.update({
							table: 't_dat_inbox',
							details: {
								sin_leer_b: 0,
								estatus: '0'
							},
							conditions: {
								id_inbox: result[0]["id_inbox"]
							},
							show_query: true
						},
						function (err, result, number_of_changed_rows) {}
					);

				}
			});
		});

		socket.on('Compras', (data) => {
			console.log('Compras .... ');
			mysql.select({
				table: 'v_orden',
				conditions: {
					comprador: sockets[socket.id]
				},
				show_query: true
			}, function (err, result) {
				if (result.length != 0) {
					socket.emit('Compras', result);
				} else {
					socket.emit('Compras', {});
				}
			});
		});

		socket.on('Ventas', (data) => {
			console.log('Ventas .... ');
			mysql.select({
				table: 'v_orden',
				conditions: {
					vendedor: sockets[socket.id]
				},
				show_query: true
			}, function (err, result) {
				if (result.length != 0) {
					socket.emit('Ventas', result);
				} else {
					socket.emit('Ventas', {});
				}
			});
		});

		socket.on('Venta', (data) => {
			console.log('VENTA .... ', data);
			connection.query('SELECT * FROM v_orden WHERE vendedor = ? AND orden = ? ', [sockets[socket.id], data.venta], function (err, result) {
				console.log(result);
				if (result.length != 0) {
					socket.emit('Venta', result[0]);
				} else {
					socket.emit('Venta', {});
				}
			});
		});

		socket.on('mensajePrivado', function (data, archivos) {

			console.log(data);

			connection.query(' SELECT * FROM t_dat_inbox WHERE f_id_usuario_a = ? AND f_id_usuario_b = ? OR f_id_usuario_b = ? AND f_id_usuario_a = ?', [data.id, sockets[socket.id], data.id, sockets[socket.id]], function (err, result) {
				if (err) throw err;

				if (result.length == 0) {
					connection.query(' INSERT INTO t_dat_inbox ( f_id_usuario_a ,f_id_usuario_b, fecha_creacion ,fecha_ultimo_msj ,estatus, sin_leer_b ) VALUES (?,?,?,?,?,?)', [data.id, sockets[socket.id], new Date(), new Date(), "0", 1], function (err, result) {

						if (err) throw err;
						console.log(result.insertId);
						if (result.affectedRows == 1) {
							connection.query(' INSERT INTO t_dat_mensajes ( f_id_inbox ,f_id_usuario, mensaje ,fecha_msj, ip  ) VALUES (?,?,?,?,?)', [result.insertId, sockets[socket.id], data.mensaje, new Date(), socket.handshake.headers.origin], function (err, result) {
								if (err) throw err;
							});
						}
					});
				} else {
					//Si el ide del usuario a es del usuario que envia el mensaje
					//UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
					if (result[0]["f_id_usuario_a"] == sockets[socket.id]) {
						connection.query(' UPDATE t_dat_inbox SET sin_leer_b = ? , estatus = ? WHERE f_id_usuario_a = ? AND  f_id_usuario_b = ?  ', [(result[0]["sin_leer_b"] + 1), '2', result[0]["f_id_usuario_a"], result[0]["f_id_usuario_b"]], function (err, result) {
							if (err) throw err;
						});
					} else {
						connection.query(' UPDATE t_dat_inbox SET sin_leer_a = ? , estatus = ? WHERE f_id_usuario_a = ? AND  f_id_usuario_b = ?  ', [(result[0]["sin_leer_a"] + 1), '1', result[0]["f_id_usuario_a"], result[0]["f_id_usuario_b"]], function (err, result) {
							if (err) throw err;
						});
					}
					console.log(result);
					//console.log(socket);
					connection.query(' INSERT INTO t_dat_mensajes ( f_id_inbox ,f_id_usuario, mensaje ,fecha_msj, ip ) VALUES (?,?,?,?,?)', [result[0].id_inbox, sockets[socket.id], data.mensaje, new Date(), socket.handshake.headers.origin], function (err, result) {
						if (err) throw err;
					});
				}
			});
			//console.log(data);
			if (usuarios[data.id] != undefined) {
				data.emisor = sockets[socket.id];
				data.fecha_msj = new Date();

				socket.broadcast.to(usuarios[data.id].sid).emit('mensajePrivado', data);
			}
		});


		//init socket io and whatever 
		var files = {},
			struct = {
				name: null,
				type: null,
				size: 0,
				data: [],
				slice: 0,
			};

		socket.on('slice upload', (data) => {
			console.log("Nueva parte del archivo:", data.name);
			if (!files[data.name]) {
				files[data.name] = Object.assign({}, struct, data);
				files[data.name].data = [];
			}

			//convert the ArrayBuffer to Buffer 
			data.data = new Buffer(new Uint8Array(data.data));
			//save the data 
			files[data.name].data.push(data.data);
			files[data.name].slice++;

			if (files[data.name].slice * 100000 >= files[data.name].size) {
				//do something with the data
				var fileBuffer = Buffer.concat(files[data.name].data);

				fs.writeFile((__dirname + '/temp/' + data.name), fileBuffer, (err) => {
					delete files[data.name];
					if (err) return socket.emit('upload error');
					socket.emit('end upload');
				});

				console.log("Termino de subirse el archivo:" + data.name);
				socket.emit('end upload');
			} else {
				socket.emit('request slice upload', {
					currentSlice: files[data.name].slice,
					name: data.name
				});
			}
		});

		socket.on('disconnect', () => {
			delete usuarios[sockets[socket.id]];
			delete sockets[socket.id];
			console.log("Desconeccion...");
			console.log(usuarios);
		});
	});
	return io;
};
