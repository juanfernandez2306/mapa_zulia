/** 
	*when max width = 960px then execute collapse navbars
	*bootstrap v5
*/
function close_navbars(){
	
	var mediaquery = window.matchMedia('(max-width: 960px)');
	
	if (mediaquery.matches){
		var collapse_navbars = document.getElementById('navbars_home'),
			bsCollapse = new bootstrap.Collapse(collapse_navbars, {
				toggle : true
			});
	}
	
}

/**
	*search value code asic
	*@param {String} id_data_list - name string id datalist ASIC
	*@param {String} input_value - text value input search ASIC
	*@returns {number|null} codigo - if is valid search name ASIC in datalist
	return number codigo else return null
*/
function is_valid_list_asic(id_data_list, input_value){
	var data_list = document.getElementById(id_data_list),
		condicion_opcion = `option[value='${input_value}']`,
		option = data_list.querySelector(condicion_opcion);
		
	if (option != null){
		var codigo = option.dataset.codigo;
		return codigo;
	}
	return null;
}

/** 
	*Remove style valid or invalid of bootstrap
	*@param {input#html} input - element html input in search ASIC
	
*/
function remove_class_validation(input){
	if(input.classList.contains('is-valid')){
		
		input.classList.remove('is-valid');
		
	}else if(input.classList.contains('is-invalid')){
		
		input.classList.remove('is-invalid');
		
	}
}

/** 
	*load POST data to view information on OffCanvas section 
	*@param {String} url - relative url text string from php script
	*@param {String} headerSidebar - text string containing html element <i/> 
					with font awesome class for the section header 
	*@param {FormData#html} elementFormData - FormData element to 
					send parameters through the POST method
*/

async function loadPOSTdataInfoSidebar(url, headerSidebar, 
	elementFormData){
	await fetch(url, {
		method : 'POST',
		body: elementFormData
	})
	.then(response => response.json())
	.then(data => {
		if(data.respuesta){
			var resultado = data.datos;
			
			addInformationOffCanvas(headerSidebar, resultado);
			
		}
	})
	.catch((error) => {
		const header = `<i class="fas fa-laptop-code"></i> Error`;
		
		addInformationOffCanvas(header, CONTENT_OFFCANVAS, true);
		console.log('Hubo un problema con la petición Fetch:' + error.message);
	});
}

/**
	* reset OffCanvas section preload style 
*/

function preloader_reboot(){
	var bodyOffcanvas = document.querySelector('div.offcanvas-body'),
		headerOffcanvas = document.querySelector('h5.offcanvas-title'),
		cuerpoOffcanvas = bodyOffcanvas.querySelector('div.row');
	
	headerOffcanvas.classList.remove('fadeIn');
	headerOffcanvas.classList.add('fadeOut');
	cuerpoOffcanvas.classList.remove('fadeIn');
	cuerpoOffcanvas.classList.add('fadeOut');
	
	headerOffcanvas.innerHTML = "";
	cuerpoOffcanvas.innerHTML = "";
	headerOffcanvas.classList.add('preloader');
	cuerpoOffcanvas.classList.add('preloader');
	
}

/**
* @typedef {Object} geojson
* @property {String} type - default value FeatureCollection
* @property {Array} features
* @property {Array} features.feature
* @property {String} features.feature.type - default value Feature
* @property {Array} features.feature.geometry
* @property {String} features.feature.geometry.type - default value Point
* @property {Array} features.feature.geometry.coordinates - [x, y] or [longitud, latitud]
* @property {Array} features.feature.properties
* @property {number} features.feature.properties.id_estab - Health establishment code in the database
* @property {number} features.feature.properties.id_tipo - Health establishment type code
*/

/** 
* Create map viewing with LEAFLET Library
* @param {Object} geojson 
*/
function create_map(geojson){
	
	document.getElementById('preloader').classList.add('d-none');
	document.getElementById('cuerpo').classList.remove('d-none');
	document.getElementById('cuerpo').classList.add('fadeIn');
	
	/** @const {Array} - [latitud, longitud] or [y, x]*/
	const coordenadas_iniciales = [9.78714, -71.70716];
	
	/** @const {number} - default 7*/
	const zoom_inicial = 7;
	
	var map = L.map('map',{
		center: coordenadas_iniciales,
		maxZoom: 18,
		minZoom: 7,
		zoom: zoom_inicial
	});
	
	L.control.scale({imperial: false}).addTo(map);
	
	//buscar asic
	var groupLayer = L.featureGroup();
	groupLayer.addTo(map);
	
	/** @const {String} - color selection feat ASIC*/
	
	const colorSelectionPolygon = "#fc8484ff";
	
	/**
		* zoom to the ASIC by searching on the map 
		* @type {HTMLElement} - input#inputASIC
		* @listens document#input - zoom extent layer ASIC in map and close navbar
	*/
	
	document.getElementById('inputASIC').addEventListener(
	'input', function(){
		var input = this,
			input_value = input.value;
		
		remove_class_validation(this);
		
		if(typeof(input_value) == 'String'){
			input_value = input_value.toUpperCase();
		}
		
		if (input_value == ''){
			remove_class_validation(this);
		}else{
			var codigo = is_valid_list_asic('opcionesASIC', input_value);
			
			if(codigo == null){
				this.classList.add('is-invalid');
			}else{
				this.classList.add('is-valid');
				
				geojson_asic['features'].filter(function(elemento){
				var cod_asic = elemento['properties']['codigo'];
				
					if(cod_asic == codigo){
						input.disabled = true;
						
						var feat = L.geoJson(elemento,{
							style: function (feature) {
								return {
								  color: colorSelectionPolygon,
								  fill: true,
								  opacity: 0,
								  clickable: false
								}
							}
						});
						
						groupLayer.addLayer(feat);
						map.fitBounds(feat.getBounds());
						
						setTimeout(function(){
							close_navbars();
							remove_class_validation(input);
							input.value = '';
							var labelASIC = document.getElementById('labelASIC');
							labelASIC.classList.add('d-none');
							input.removeAttribute('disabled');
						}, 2000);
						
						
						setTimeout(function(){
							groupLayer.removeLayer(feat);
						}, 5000);
						
					}
				})
				
			}
		}
		
	}, false);
	
	/**
	*load geojson health establishments in map
	*/
	const url_hospital = 'assets/svg/hospital.svg',
		url_cdi = 'assets/svg/cdi.svg',
		url_raes = 'assets/svg/raes.svg',
		url_racs = 'assets/svg/racs.svg';
		
	
	/** @const {Array} - HTML element [i, button]*/
	const btn_close_offcanvas = [
		document.querySelector('i[data-bs-dismiss="offcanvas"]'),
		document.querySelector('button[data-bs-dismiss="offcanvas"]')
	];
	
	for(var btn_elem = 0; btn_elem < btn_close_offcanvas.length; btn_elem++){
		/**
		* Add class preloader when closing OffCanvas section
		* @type {HTMLElement} - [i|button]#btn_close_offcanvas[i]
		* @listens document#[i|button]
		*/
		btn_close_offcanvas[btn_elem].addEventListener(
			'click', preloader_reboot, false
		);
	}
		
	function onEachFeature(feature, layer) {
		layer.on('click', function(e){
			var id_estab = e.target.feature.properties.id_estab,
				sidebar = document.getElementById('sidebar_offcanvas'),
				elemento_offcanvas = new bootstrap.Offcanvas(sidebar),
				datos = new FormData(),
				url = 'assets/php/consulta_codigo_establecimiento.php',
				headerSidebar = `<i class='fas fa-hospital'></i>Establecimiento de Salud`;
				
			datos.append('id_estab', id_estab);
			
			loadPOSTdataInfoSidebar(
				url, headerSidebar, datos
			)
				
			elemento_offcanvas.show();
		});
	}
	
	/**
		*selection of the type of icon according 
		to the feature id_tipo parameter of geojson layer
		*@param {Object} feature - feature of geojson
		*@param {Object} latlng - feature of geojson apply leafletjs
	*/
		
	function selection_establishments_icons(feature, latlng){
		var icon;
		
		if (feature.properties.id_tipo == 1){
			icon = L.marker(latlng,
				{icon: L.icon({iconUrl: url_hospital,
				iconSize: [35, 35]})
				}
			);
		}else if(feature.properties.id_tipo == 2){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: url_cdi,
						iconSize: [30, 30]
					})
				}
			);
		}else if(feature.properties.id_tipo == 3){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: url_raes,
						iconSize: [30, 30]
					})
				}
			);
		}else if(feature.properties.id_tipo == 4){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: url_racs,
						iconSize: [30, 30]
					})
				}
			);
		}
		
		return icon;
	};
	
	/**
		*filter geojson layers according to the type 
		of health establishment to define the icon,
		*@param {Number} id_tipo - feature of geojson
		default values
		1 -> hospital
		2 -> cdi
		3 -> raes
		4 -> racs
	*/
	
	function filter_layers_geojson(id_tipo){
		return L.geoJson(geojson,{
			filter: function(feature, layer){
				return feature.properties.id_tipo == id_tipo
			},
			pointToLayer: selection_establishments_icons,
			onEachFeature: onEachFeature
		});
		
	}
	
	var hospital = filter_layers_geojson(1),
		cdi = filter_layers_geojson(2),
		raes = filter_layers_geojson(3),
		racs = filter_layers_geojson(4);
		
	var parentGroup = L.markerClusterGroup(),
		SubGroupHospitales = L.featureGroup.subGroup(parentGroup, [hospital]);
		SubGroupCDI = L.featureGroup.subGroup(parentGroup, [cdi]),
		SubGroupRAES = L.featureGroup.subGroup(parentGroup, [raes]),
		SubGroupRACS = L.featureGroup.subGroup(parentGroup, [racs]);
		
	var baseLayers = null;
	
	var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
	}).addTo(map);
		
	var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L',
		bingLayer = L.tileLayer.bing(BING_KEY);
		
	baseLayers = {
		"base Cartografica": osm,
		"Imagen Satelital": bingLayer
	};
		
	control = L.control.layers(baseLayers, null, 
	{ collapsed: true,  position: 'topright'}).addTo(map);
	
	control.addOverlay(SubGroupHospitales, 
		`<img src="${url_hospital}" width="35"><b>HOSPITALES</b>`);
	control.addOverlay(SubGroupCDI, 
		`<img src="${url_cdi}" width="30"><b>CDI</b>`);
	control.addOverlay(SubGroupRAES, 
		`<img src="${url_raes}" width="30"><b>RAES</b>`);
	control.addOverlay(SubGroupRACS, 
		`<img src="${url_racs}" width="30"><b>RACS</b>`);
		
	parentGroup.addTo(map);
	SubGroupHospitales.addTo(map);
	SubGroupCDI.addTo(map);
	SubGroupRAES.addTo(map);
	SubGroupRACS.addTo(map);
	
	/**
	# restart initial zoom and close navbar on click 
	* @type {HTMLElement} - a#default_extent
	* @listens document#click - zoom extent map and close navbar
	*/
	document.getElementById('default_extent').addEventListener('click', function(e){
		e.preventDefault();
		
		map.setView(coordenadas_iniciales, zoom_inicial);
		
		close_navbars();
		
	}, false);
	
	/**
	define query layer ASIC
	*/
	
	function consultToFeature(e){
		var cod_asic = e.target.feature.properties.codigo,
			sidebar = document.getElementById('sidebar_offcanvas'),
			elemento_offcanvas = new bootstrap.Offcanvas(sidebar),
			datos = new FormData(),
			url = 'assets/php/consulta_codigo_asic.php',
			headerSidebar = `<i class='fas fa-map-marked-alt'></i>ASIC`;
				
			datos.append('cod_asic', cod_asic);
			
			map.fitBounds(e.target.getBounds());
			
			elemento_offcanvas.show();
			
			loadPOSTdataInfoSidebar(
				url, headerSidebar, datos
			);
	}
	
	/**
	*Create GEOJSON layer to consult information in database
	*@param {String} colorName - Hexadecimal color code
	*@param {String} colorSelectionPolygon - Hexadecimal color code
	*@returns {Object} geojson - Object L.geoJson of the ASIC layer 
	*/
	
	function createLayerPolygonSearch(colorName, colorSelectionPolygon){
		
		function style(feature){
			return {
				weight: 2,
				opacity: 1,
				color: colorName,
				dashArray: '3',
				fillOpacity: 0.1
			};
		}
		
		function highlightFeature(e){
			var layer = e.target;
			
			layer.setStyle({
				fillColor: colorSelectionPolygon,
				weight: 5,
				color: colorName,
				dashArray: '',
				fillOpacity: 0.7
			});
			
		}
		
		function resetHighlight(e){
			layerASIC.resetStyle(e.target);
		}
		
		function onEachFeatureConsult(feature, layer){
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: consultToFeature
			});
		}
		
		return layerConsultASIC = L.geoJson(geojson_asic, {
			style: style,
			onEachFeature: onEachFeatureConsult
		});
	}
	/**
	*Create GEOJSON layer
	*@param {String} colorName - Hexadecimal color code
	*@param {String} colorSelectionPolygon - Hexadecimal color code
	*@returns {Object} geojson - Object L.geoJson of the ASIC layer 
	*/
	function createLayerPolygonSimple(colorName){
		return L.geoJson(geojson_asic, {
			style: function (feature) {
				return {
				  color: colorName,
				  fill: false,
				  opacity: 1,
				  clickable: false
				}
			}
		});
	}
	
	var layerASIC = createLayerPolygonSimple('black');
	
	groupLayer.addLayer(layerASIC);
	
	/**
	* select ASIC layer type to confirm query  
	* @type {HTMLElement} - input[name="consulta_capa"]
	* @listens document#click - zoom extent map and close navbar
	*/
	
	if (document.querySelector('input[name="consulta_capa"]')){
		document.querySelectorAll('input[name="consulta_capa"]').forEach(
			(elem) => {
				elem.addEventListener("change", function(event){
						var item = event.target.value,
							inputASIC = document.getElementById('inputASIC');
						
						var seccionRadioAsic = document.getElementById('seccionRadioAsic'),
							textBaseLayer = seccionRadioAsic.dataset.map;
						
						var texto = '¿Confirme su opcion?'
						if(item.toLowerCase() == 'si'){
							var confirmarOption = window.confirm(texto);
								
							if(confirmarOption){
								close_navbars();
								groupLayer.removeLayer(layerASIC);
								
								if(textBaseLayer == 'base cartografica'){
									colorName = 'black';
								}else{
									colorName = 'white';
								}
								
								layerASIC = createLayerPolygonSearch(
									colorName, 
									colorSelectionPolygon
								);
								
								groupLayer.addLayer(layerASIC);
								inputASIC.disabled = true;
							}else{
								document.getElementById('radio_reject').checked = true;
								inputASIC.removeAttribute('disabled');
							}
							
						}else{
							var confirmarOption = window.confirm(texto);
								
							if(confirmarOption){
								close_navbars();
								groupLayer.removeLayer(layerASIC);
								
								if(textBaseLayer == 'base cartografica'){
									colorName = 'black';
								}else{
									colorName = 'white';
								}
								
								layerASIC = createLayerPolygonSimple(colorName);
								
								groupLayer.addLayer(layerASIC);
								inputASIC.removeAttribute('disabled');
							}else{
								document.getElementById('radio_confirm').checked = true;
								inputASIC.disabled = true;
							}
							
						}
					}
				);
		});
	}
	
	const headerSidebar_info = '<i class="fas fa-info-circle"></i>Información';
		headerSidebar_legend = '<i class="fas fa-bookmark"></i>Leyenda',
		divInformationCreation = elementPInformation.concat(
			createFormatFooter(LINK_TWITTER, LINK_GMAIL, LINK_GMAIL)
		);
		
	loadInformationButtonNavBars(
		'info_proyecto', 
		headerSidebar_info,
		divInformationCreation
		);
		
	loadInformationButtonNavBars(
		'info_legend',
		headerSidebar_legend,
		null,
		createDivLegend
	);
	
	function verifyCoordinateLimits(leafletObjectLatLng){
		var lat= leafletObjectLatLng.lat,
			lng = leafletObjectLatLng.lng;
			
		var limitLat = lat >= 8.36808 && lat <= 11.85079,
			limitLng = lng >= -73.37939 && lng <= -70.66714;
			
		if(limitLat == true && limitLng == true){
			return true;
		}else{
			return false;
		}
	}
	
	function activeGeolocation(e){
		e.preventDefault();
		
		var btn = e.target,
			span = document.getElementById('icon_geolocation');
			
		btn.classList.add('disabled');
		span.classList.remove('fas');
		span.classList.remove('fa-map-marker-alt');
		span.getAttribute('role', 'status');
		span.getAttribute('aria-hidden', true);
		span.classList.add('spinner-grow');
		span.classList.add('spinner-grow-sm');
		
		map.locate({setView: true, maxZoom: 16});
		
		function removeStyleSpanGeolocation(){
			span.removeAttribute('role');
			span.removeAttribute('aria-hidden');
			span.classList.remove('spinner-grow');
			span.classList.remove('spinner-grow-sm');
			span.classList.add('fas');
			span.classList.add('fa-map-marker-alt');
		}
		
		function onLocationFound(e){
			var radius = e.accuracy,
				coordinates_location = e.latlng;
				
			verifyLimitPoint = verifyCoordinateLimits(coordinates_location);
			
			removeStyleSpanGeolocation();
			close_navbars();
			
			if (verifyLimitPoint == false){
				
				sidebar = document.getElementById('sidebar_offcanvas'),
				elemento_offcanvas = new bootstrap.Offcanvas(sidebar),
				headerSidebar = `<i class='fas fa-exclamation-triangle'></i> Notificación`,
				contentMsg = `<div class="alert alert-danger" role="alert">
				  ¡Disculpe! Usted se encuentra 
				  fuera del área de influencia del estado Zulia – Venezuela.
				</div>`;
				elemento_offcanvas.show();
				
				addInformationOffCanvas(headerSidebar, contentMsg);
				
			}else{
				
				var bounds_location = e.bounds;
			
				var colorMarker = 'blue',
					nameIcon = 'user';
				
				if (radius <= 10){
					class_alert = 'alert-primary';
					msj = `<i class="fas fa-check-circle"></i>La geolocalización de tu dispositivo 
					fue satisfactoria, con muy buena precisión.`;
				}else if (radius > 10 && radius <= 30){
					class_alert = 'alert-warning';
					msj = `<i class="fas fa-exclamation-triangle"></i>El cálculo del posicionamiento del dispositivo, 
					no es el optimo, pudiera estar a varios metros de tu ubicación real.`;
				}else{
					colorMarker = 'red';
					nameIcon = 'user-times';
					class_alert = 'alert-danger';
					radius = Math.round(radius);
					msj = `<i class="fas fa-exclamation-circle"></i>La incertidumbre del posicionamiento del 
					dispositivo es muy alta, pudiendo estar mínimo a ${radius} metros de tu ubicación real.`;
				}
				
				var blueMarker = L.AwesomeMarkers.icon({
					icon: nameIcon,
					prefix : 'fa',
					markerColor: colorMarker
				});

				var markerPoint = L.marker(coordinates_location, {icon: blueMarker}),
					alert_msj = `<div class="alert ${class_alert} geoLocationPopup" role="alert">
					  ${msj}
					</div>`;
				
				markerPoint.bindPopup(alert_msj);
				
				var circle_accuracy = L.circle(e.latlng, radius, {color: colorMarker});
				
				map.addLayer(markerPoint);
				map.addLayer(circle_accuracy);
				
				var remove_location = document.getElementById('remove_location'),
					zoom_location = document.getElementById('zoom_location');
					
				remove_location.classList.remove('disabled');
				zoom_location.classList.remove('disabled');
				
				function getZoomLocation(e){
					e.preventDefault();
					close_navbars();
					map.fitBounds(bounds_location);
				}
				
				function removeLayerLocation(e){
					e.preventDefault();
					var btn_remove = e.target;
					btn_remove.classList.add('disabled');
					
					close_navbars();
					zoom_location.classList.add('disabled');
					map.removeLayer(markerPoint);
					map.removeLayer(circle_accuracy);
					
					btn_remove.removeEventListener('click', removeLayerLocation, false);
					zoom_location.removeEventListener('click', getZoomLocation, false);
					
					setTimeout(function(){
						btn.classList.remove('disabled');
					}, 2000)
					
				}
				
				zoom_location.addEventListener('click', 
					getZoomLocation, false);
				
				remove_location.addEventListener('click', 
					removeLayerLocation, false);
				
			}
		}
		
		function onLocationError(e){
			removeStyleSpanGeolocation();
			btn.classList.remove('disabled');
			alert('Acceso denegado en el dispositivo para el proceso de geolocalización')
			console.log(e.message);
		}
		
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
		
	}
	
	/**
	*  
	* @type {HTMLElement} - a#geolocalizacion
	* @listens document#click - start geo-localization process in leafletjs
	*/
	
	document.getElementById('geolocalizacion').addEventListener('click', activeGeolocation, false);

	var offlineMsgBox = L.control({
		position: 'bottomleft'
	});
	
	offlineMsgBox.onAdd = function(e){
		var div = L.DomUtil.create('div'),
			html = `
			<div class="alert alert-danger desconect" role="alert">
			<i class="fas fa-user-times preloader_icon"></i>Reconectando...
			</div>`;
			
		div.innerHTML = html;
		
		return div;
	}
	
	function checkStatusConect(event){
		if(navigator.onLine){
			offlineMsgBox.remove();
		}else{
			offlineMsgBox.addTo(map);
		}
	}
	
	window.addEventListener('online', checkStatusConect, false);
	window.addEventListener('offline', checkStatusConect, false);
	
	/**
	*  
	* @type {HTMLElement} - input[type="radio"].leaflet-control-layers-selector
	* @listens document#click - 
	*/
	
	const inputControlLayerBase = 'input[type="radio"].leaflet-control-layers-selector';

	if (document.querySelector(inputControlLayerBase)){
		document.querySelectorAll(inputControlLayerBase).forEach(
			(elem) => {
				elem.addEventListener("change", function(event){
					var item = event.target;
						span = item.nextSibling;
					
						if(span != null){
							var textSpan = span.innerHTML.trim().toLowerCase(),
								seccionRadioAsic = document.getElementById('seccionRadioAsic'),
								radioBtn = document.querySelector('input[name="consulta_capa"]:checked');
							
							/**add name base layer in data of #seccionRadioAsic*/
							seccionRadioAsic.setAttribute('data-map', textSpan);
							
							groupLayer.removeLayer(layerASIC);
							
							if(textSpan == 'base cartografica'){
								colorName = 'black';
							}else{
								colorName = 'white';
							}
							
							if(radioBtn.id == 'radio_confirm'){
								layerASIC = createLayerPolygonSearch(
									colorName, 
									colorSelectionPolygon
								);
							}else{
								layerASIC = createLayerPolygonSimple(colorName);
							}
							
							groupLayer.addLayer(layerASIC);
							
						}
					
					}
				);
		});
	}
}