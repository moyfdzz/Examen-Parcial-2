let express = require( 'express' );
let bodyParser = require( 'body-parser' );
let mongoose = require( 'mongoose' );
let jsonParser = bodyParser.json();
let { DATABASE_URL, PORT } = require( './config' );

let app = express();

let server;

let bookmarks = [
{
	id: "0da8b32a-aaff-434f-1bdd-77985e285ba3",
	titulo: "Google",
	descripcion: "El sabiondo",
	url: "https://www.google.com"
},
{
	id: "f38c7e59-55dd-433b-2fff-c350bb8f9ce5",
	titulo: "Facebook",
	descripcion: "La mega red social",
	url: "https://www.facebook.com"
},
{
	id: "70f10dcb-d7ca-4476-93fe-a2ad6a4994a7",
	titulo: "YouTube",
	descripcion: "Videos para todos",
	url: "https://www.youtube.com"
},
{
	id: "d6362ed6-5825-4c45-a7f4-0d2bbd005ebf",
	titulo: "Wikipedia",
	descripcion: "La tia wiki",
	url: "https://www.wikipedia.org"
}];

app.put('/api/bookmarks/:id', jsonParser, (req,res) => {
	let idCuerpo = req.body.id;
	let idParametro = req.params.id;

	if (idCuerpo == undefined) {
		res.statusMessage = 'Error 406: El id no fue enviado en el cuerpo.';

		return res.status(406).send();
	}

	if (idCuerpo !== idParametro) {
		res.statusMessage = 'Error 409: El id del cuerpo no coincide con el id enviado como parámetro.';

		return res.status(409).send();
	}

	let titulo = req.body.titulo;
	let descripcion = req.body.descripcion;
	let url = req.body.url;

	if (titulo === '' && descripcion === '' && url === '') {
		res.statusMessage = 'Ingrese todos los datos para actualizar un bookmark existente.';

		return res.status(406).send();
	}

	let foundBookmark = false;
	let updatedBookmark;

	bookmarks.forEach((bookmark) => {
		if (bookmark.id.toString() === idParametro) {
			foundBookmark = true;

			if (titulo !== '') {
				bookmark.titulo = titulo;
			}

			if (descripcion !== '') {
				bookmark.descripcion = descripcion;
			}

			if (url !== '') {
				bookmark.url = url;
			}

			updatedBookmark = bookmark;
		}
	});

	if (!foundBookmark) {
        res.statusMessage = 'No existe un bookmark con el título ingresado.';

        return res.status(404).send();
    }

    return res.status(202).send(updatedBookmark);
});

function runServer( port, databaseUrl ){
	return new Promise( (resolve, reject ) => {
		mongoose.connect( databaseUrl, response => {
			if ( response ){
				return reject( response );
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then( () => {
			return new Promise( (resolve, reject) => {
				console.log( 'Closing the server' );
				server.close( err => {
					if ( err ){
						return reject( err );
					}
					else{
						resolve();
					}
				});
			});
		});
}
runServer( PORT, DATABASE_URL );

module.exports = { 
    app, 
    runServer, 
    closeServer 
}