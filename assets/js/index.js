function activarLabelASIC(){
	var texto = this.value,
		label = document.getElementById('labelASIC');
	
	if (texto == ''){
		label.classList.add('d-none');
	}else{
		if(label.classList.contains('d-none')){
			label.classList.remove('d-none');
		}
	}
}

function agregar_datalist_asic(opciones){
	document.getElementById('opcionesASIC').innerHTML = opciones;
	document.getElementById('inputASIC').addEventListener(
	'input', activarLabelASIC, false);
}

async function descargar_datos(url, callback = null){
	await fetch(url)
	.then(respuesta => respuesta.json())
	.then(datos => {
		if(datos.respuesta){
			var resultado = datos.datos
			if (typeof callback == 'function'){
				callback(resultado);
			}
		}
	})
	.catch((error) => {
		
		createAlertPreload(
			LINK_TWITTER,
			LINK_GMAIL,
			LINK_LINKEDIN,
			CONTENT_ALERT_ERROR_FETCH,
			'#textSpinner'
		);
		console.log('Hubo un problema con la petición Fetch:' + error.message);
	});
}

function iniciar(){
	
	fetch(ruta_listado_asic)
	.then(respuesta => respuesta.json())
	.then(datos => {
		if(datos.respuesta){
			var resultado = datos.datos;
			agregar_datalist_asic(resultado);
		}
	})
	.then(datos => {
		
		descargar_datos(ruta_geojson, create_map);
		
	})
	.catch((error) => {
		
		createAlertPreload(
			LINK_TWITTER,
			LINK_GMAIL,
			LINK_LINKEDIN,
			CONTENT_ALERT_ERROR_FETCH,
			'#textSpinner'
		);
		console.log('Hubo un problema con la petición Fetch:' + error.message);
		
	});
	
}

window.addEventListener('load', iniciar, false)