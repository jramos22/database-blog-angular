'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 3900;
//mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose
	.connect(
		'mongodb+srv://zangetsu22cr:Joseda199922@cluster0.2zqnv.mongodb.net/api_rest_blog?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('La coneccion a la base de datos se a ejecutado bien');

		//crear servidor y ponerme  a escuchar peticiones htpp
		app.listen(PORT, () => {
			console.log('Servidor Corriendo en http://localhost:' + PORT);
		});
	});
