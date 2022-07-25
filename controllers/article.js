'use strict';

const validator = require('validator');
const Article = require('../models/article');
const fs = require('fs');
const path = require('path');

const controller = {
	datosCurso: (req, res) => {
		const hola = req.body.hola;

		return res.status(200).send({
			curso: ['React', 'Angular', 'Vue'],
			autor: 'José Ramos',
			url: 'github.com',
			hola,
		});
	},

	test: (req, res) => {
		return res.status(200).send({
			message: 'Soy la acción test de mi controlador de articulos',
		});
	},

	save: (req, res) => {
		// Recoger parametros por post

		var params = req.body;

		console.log(params);

		// validar datos (validator)

		try {
			var validate_title = !validator.isEmpty(params.title);

			var validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(200).send({
				status: 'error',

				message: 'Faltan datos por enviar !!!',
			});
		}

		if (validate_title && validate_content) {
			// Crear el objeto a guardar

			var article = new Article();

			//Asignar valores las articles

			article.title = params.title;

			article.content = params.content;

			if (params.image) {
				// Inicia el codigo que cambio

				article.image = params.image;
			} else {
				article.image = null;
			} // Fin del codigo que cambio

			// Guardar el articulo

			article.save((err, articleStore) => {
				if (err || !articleStore) {
					return res.status(404).send({
						status: 'error',

						message: 'El articulo no se ha guardado !!!',
					});
				}

				// Devolver una respuesta

				return res.status(200).send({
					status: 'success',

					article: articleStore,
				});
			});
		} else {
			return res.status(200).send({
				status: 'error',

				message: 'Los datos no son validos',
			});
		}
	},
	getArticles: (req, res) => {
		const query = Article.find({});
		const last = req.params.last;
		if (last || last != undefined) {
			query.limit(5);
		}
		//find
		query.sort('-_id').exec((err, articles) => {
			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'error al devolver los articulos',
				});
			}
			if (!articles) {
				return res.status(404).send({
					status: 'error',
					message: 'no hay articulos para mostrar',
				});
			}
			return res.status(200).send({
				status: 'success',
				articles,
			});
		});
	},
	getArticle: (req, res) => {
		//recoger el Id de la url
		const articleId = req.params.id;
		//comprobar que existe
		if (!articleId || articleId == null) {
			return res.status(404).send({
				status: 'error',
				message: 'no existe el articulo',
			});
		}
		//buscar el article
		Article.findById(articleId, (err, article) => {
			if (err || !article) {
				return res.status(404).send({
					status: 'error',
					message: 'no existe el articulo',
				});
			}
			//Devolver el JSON
			return res.status(200).send({
				status: 'success',
				article,
			});
		});
	},
	update: (req, res) => {
		//recoger el Id del articulo por la url
		const articleId = req.params.id;
		//recoger los datos que llegan por put
		const params = req.body;
		//validar los datos
		try {
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(404).send({
				status: 'error',
				message: 'no se puede actualizar los datos',
			});
		}
		if (validate_title && validate_content) {
			//Find and update
			Article.findByIdAndUpdate(
				{ _id: articleId },
				params,
				{ new: true },
				(err, articleUpdated) => {
					if (err) {
						return res.status(500).send({
							status: 'error',
							message: 'error al actualizar',
						});
					}

					if (!articleUpdated) {
						return res.status(404).send({
							status: 'error',
							message: 'no existe el acticulo',
						});
					}

					return res.status(200).send({
						status: 'success',
						articleUpdated,
					});
				}
			);
		} else {
			return res.status(200).send({
				status: 'error',
				message: 'La validación no es correcta',
			});
		}
	},
	delete: (req, res) => {
		//recoger el Id de lka url
		const articleId = req.params.id;
		//hacer un find and delete
		Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'error al borrar',
				});
			}
			if (!articleRemoved) {
				return res.status(404).send({
					status: 'error',
					message:
						'No se ha borrado el articulo, posiblemente no exista',
				});
			}
			return res.status(200).send({
				status: 'success',
				article: articleRemoved,
			});
		});
	},
	upload: (req, res) => {
		// Configurar el modulo connect multiparty router/article.js (hecho)

		// Recoger el fichero de la peticiones

		var file_name = 'Imagen no subida..';

		if (!req.files) {
			return res.status(404).send({
				status: 'error',

				message: file_name,
			});
		}

		// Conseguir el nomre y la extencion del archivo para

		var file_path = req.files.file0.path;

		var file_split = file_path.split('\\');

		/*ADVERTENCIA * EN LINUX O MAC*/

		//var file_split = file_path.split('/');

		// Nombre del archivo para

		var file_name = file_split[2];

		// Extension de la extencion del archivo

		var extension_split = file_name.split('.');

		var file_exp = extension_split[1];

		// Comprobar la extencion, solo imagenes, si es valida borrar el fichero de

		if (
			file_exp != 'png' &&
			file_exp != 'jpg' &&
			file_exp != 'jpeg' &&
			file_exp != 'gif'
		) {
			// borrar archivo subido

			fs.unlink(file_path, (err) => {
				return res.status(200).send({
					status: 'error',

					message: 'La extension de la imagen no es valida !!!',
				});
			});
		} else {
			// si todo es valido, sacando id de la url

			var articleId = req.params.id;

			if (articleId) {
				// Desde aca inicia el codigo que cambio

				// Buscar el articulo, asignarle el nombre de la imagen y actualizar

				Article.findOneAndUpdate(
					{ _id: articleId },
					{ image: file_name },
					{ new: true },
					(err, articleUpdate) => {
						if (err || !articleUpdate) {
							return res.status(200).send({
								status: 'error',

								article:
									'Error al guardar la imagen de articulo',
							});
						}

						return res.status(200).send({
							status: 'success',

							article: articleUpdate,
						});
					}
				);
			} else {
				return res.status(200).send({
					status: 'success',

					image: file_name,
				});
			} // Aca finaliza el codigo que cambio
		}
	}, // end upload file
	getImage: (req, res) => {
		const file = req.params.image;
		const path_file = './upload/articles/' + file;

		if (fs.existsSync(path_file)) {
			return res.sendFile(path.resolve(path_file));
		} else {
			return res.status(404).send({
				status: 'error',
				mesagge: 'ninguna image con este nombre',
			});
		}
	},
	search: (req, res) => {
		//sacar el string a buscar
		const searchString = req.params.search;

		//find or
		Article.find({
			$or: [
				{ title: { $regex: searchString, $options: 'i' } },
				{ content: { $regex: searchString, $options: 'i' } },
			],
		})
			.sort([['date', 'descending']])
			.exec((err, articles) => {
				if (err) {
					return res.status(500).send({
						status: 'error',
						mesagge: 'error en la peticion',
					});
				}
				if (!articles || articles.length <= 0) {
					return res.status(404).send({
						status: 'error',
						mesagge:
							'error no hay articulos que coinsidan con tu busqueda',
					});
				}
				return res.status(200).send({
					status: 'success',
					articles,
				});
			});
	},
};
//end controller

module.exports = controller;
