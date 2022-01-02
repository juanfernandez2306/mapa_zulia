const LINK_TWITTER = 'https://twitter.com/juancho_2306',

	LINK_GMAIL = 'mailto:juanfernandez2306@gmail.com?Subject=Informacion%20sobre%20el%20mapa',
	
	LINK_LINKEDIN = '#',
	
	CONTENT_ALERT_ERROR_FETCH = `Ocurrió un error con la petición en el servidor. 
	Contacte con el administrador del sistema.`,
	
	CONTENT_OFFCANVAS = `Ocurrió un error con la petición en el servidor. 
	Verifique su conexión a internet. 
	Si persiste el problema contacte con el administrador del sistema.`,
	
	elementPInformation = `<p>
	Plantilla  de diseño web adaptable  (del ingles <i>responsive web design</i>) 
	para crear aplicaciones de mapas web con 
	<a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/" target="_blank">Bootstrap 5</a>
	y 
	<a href="https://leafletjs.com/" target="_blank">Leaflet</a>, 
	código abierto con licencia MIT, disponible en 
	<a href="https://github.com/juanfernandez2306/mapa_zulia"
	target="_blank">GitHub</a>.</p>
	<div class="card">
	  <div class="card-body">
		<h5 class="card-title">Descripción</h5>
		<ul class="list-group">
			<li class="list-group-item">
				<a 
				href="https://drive.google.com/file/d/1gkPXti_LChM5F73EMAtw6ND-1V5I3hak/view"
				target="_blank">
					<i class="fas fa-file-pdf"></i>
					TEG - Universidad del Zulia.
				</a>
			</li>
			<li class="list-group-item">
				<abbr 
					title="Hypertext Preprocessor" 
					class="initialism">PHP</abbr>
				como lenguaje de programación Backend para servir 
				y gestionar peticiones en el servidor.
			</li>
			<li class="list-group-item">
				Manejo de Font Awesome como fuente web que 
				contiene todos los iconos del Framework Bootstrap.
			</li>
			<li class="list-group-item">
				Agrupación lógica de marcadores de múltiples capas (<i>marker clustering</i>) 
				a través del <a
				href="https://github.com/Leaflet/Leaflet.markercluster"
				target="_blank">leaflet marker cluster plugin</a>.
			</li>
			<li class="list-group-item">
				Ultima actualización de la capa de establecimientos de salud en Diciembre de 2018
			</li>
		</ul>
	  </div>
	</div>`,
	
	DOMAIN_NAME = 'localhost';
	
	const ruta_listado_asic = 'assets/php/consulta_listado_asic.php';
	const ruta_geojson = 'assets/php/geojson.php';
	
function createFormatFooter(
	link_twitter, 
	link_gmail,
	link_linkedin){
	
	var divElementFooter = `
		<div class="container">
			<footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
			<div class="col-md-4 col-lg-5 d-flex align-items-center">
				<span class="text-muted">&copy; 2022 Juan Fernandez</span>
			</div>

			<ul class="nav col-md-4 col-lg-6 justify-content-end list-unstyled d-flex">
				<li class="ms-3">
					<a class="text-muted" href="${link_gmail}">
						<svg class="icon_contact"><use xlink:href="#gmail"/></svg>
					</a>
				</li>
				<li class="ms-3">
					<a class="text-muted" href="${link_twitter}">
						<svg class="icon_contact"><use xlink:href="#twitter"/></svg>
					</a>
				</li>
				<li class="ms-3">
					<a class="text-muted" href="${link_linkedin}">
						<svg class="icon_contact"><use xlink:href="#linkedin"/></svg>
					</a>
				</li>
			</ul>
			</footer>
		</div>
	`;
	
	return divElementFooter;
}

function createAlertPreload(link_twitter,
	link_gmail, link_linkedin, 
	content_alert,
	elementDivHTML){
	
	const footer = createFormatFooter(
		link_twitter, 
		link_gmail,
		link_linkedin);
		
	var divElementAlert = `
	<div class="d-flex justify-content-center">
		<div class="alert alert-danger" 
		role="alert">
			<i class="fas fa-exclamation-triangle"></i>
			${content_alert}
			${footer}
		</div>
	</div>`
	
	const elementDiv = document.querySelector(elementDivHTML);
	
	elementDiv.innerHTML = divElementAlert;
	elementDiv.classList.add('fadeIn');
}

function addInformationOffCanvas(contentHeader, 
	contentBody, 
	errorMessage = false,
	link_twitter = LINK_TWITTER,
	link_gmail = LINK_GMAIL,
	link_linkedin = LINK_LINKEDIN
	){
	const ELEMENT_HTML_HEADER = 'h5.offcanvas-title',
		ELEMENT_DIV_ROW_BODY = 'div.offcanvas-body div.row',
		bodyOffCanvas = document.querySelector(ELEMENT_DIV_ROW_BODY),
		headerOffCanvas = document.querySelector(ELEMENT_HTML_HEADER);
		
	if(headerOffCanvas.classList.contains('fadeOut')){
		headerOffCanvas.classList.remove('fadeOut');
	}
	
	if(bodyOffCanvas.classList.contains('fadeOut')){
		bodyOffCanvas.classList.remove('fadeOut');
	}
	
	headerOffCanvas.classList.remove('preloader');
	headerOffCanvas.innerHTML = contentHeader;
	headerOffCanvas.classList.add('fadeIn');
	bodyOffCanvas.classList.remove('preloader');
	
	if(errorMessage){
		createAlertPreload(
			link_twitter,
			link_gmail, 
			link_linkedin, 
			contentBody,
			ELEMENT_DIV_ROW_BODY)
	}else{
		bodyOffCanvas.innerHTML = contentBody;
		bodyOffCanvas.classList.add('fadeIn');
	}
	
}

async function downloadImg(urlRelativeImg){
	const urlAbsoluteImg = `${urlRelativeImg}`,
		response = await fetch(urlAbsoluteImg),
		blob = await response.blob(),
		urlImg = URL.createObjectURL(blob);
		
	return urlImg;
	
}

function createDivLegend(contentHeader){
	Promise.all([
		downloadImg('assets/svg/hospital.svg'),
		downloadImg('assets/svg/cdi.svg'),
		downloadImg('assets/svg/raes.svg'),
		downloadImg('assets/svg/racs.svg'),
		downloadImg('assets/svg/asic.svg')]
	)
	.then((imagenes) => {
		divLegend = `<div class="row align-items-center rowColor">
			<div class="col-2">
				<img class="legend" src="${imagenes[0]}">
			</div>
			<div class="col-10">Hospital</div>
		</div>
		<div class="row align-items-center">
			<div class="col-2">
				<img class="legend" src="${imagenes[1]}">
			</div>
			<div class="col-10">
				Centro de Diagnóstico Integral de Salud (CDI)
			</div>
		</div>
		<div class="row align-items-center rowColor">
			<div class="col-2">
				<img class="legend" src="${imagenes[2]}">
			</div>
			<div class="col-10">
				Red Ambulatoria Especializada de Salud (RAES)
			</div>
		</div>
		<div class="row align-items-center">
			<div class="col-2">
				<img class="legend" src="${imagenes[3]}">
			</div>
			<div class="col-10">
				Red de Atención Comunal de Salud (RACS) ó Red de Atención Primaria de Salud (APS)
			</div>
		</div>
		<div class="row align-items-center rowColor">
			<div class="col-2">
				<img class="legend" src="${imagenes[4]}">
			</div>
			<div class="col-10">
				Polígono del Área de Salud Integral Comunitaria (ASIC)
			</div>
		</div>`;
		
		addInformationOffCanvas(contentHeader, divLegend);
		
	})
	.catch((error) => {
		addInformationOffCanvas(contentHeader, '', true);
		console.log(error);
	})
}

/**
*load content and header of OffCanvas section
*@param {String} elementIDtarget - html target identifier name ID
*@param {String} contentHeader
*@param {String} contentBody
*@param {function} callback
*/

function loadInformationButtonNavBars(elementIDtarget, 
contentHeader, contentBody, callback = null){
	
	document.getElementById(elementIDtarget).addEventListener('click', function(e){
		e.preventDefault();
		var btn = e.target,
			sidebar = document.getElementById('sidebar_offcanvas'),
			elemento_offcanvas = new bootstrap.Offcanvas(sidebar);
		
		btn.classList.add('disabled');
		close_navbars();
		elemento_offcanvas.show();
		
		if(typeof callback == 'function'){
			
			//callback(contentHeader, contentBody);
			callback(contentHeader);
			
		}else{
			setTimeout(function(){
				addInformationOffCanvas(contentHeader, contentBody);
			}, 1500);
			
		}
		
		setTimeout(function(){
			btn.classList.remove('disabled');
		}, 2000);
	}, false);
	
}