<?php 
	require_once('funciones.php');
	
	$mysqli = new mysqli($HOST, $USER, $PASSWORD, $BD);
	
	if ($mysqli->connect_error){
		die('Error de Conexión');};
	
	$mysqli -> set_charset('utf8');
	
	$sql = file_get_contents('sql/consulta_geojson.sql');
		
	$consulta = $mysqli -> query($sql);
	
	if($consulta){
		$respuesta = true;
		
		$geojson = array(
			'type'      => 'FeatureCollection',
			'features'  => array()
		);
		
		while ($row = $consulta -> fetch_assoc()){
			
			$feature = array(
				'type' => 'Feature',
				'geometry' => array(
					'type' => 'Point',
					'coordinates' => array($row['x'], $row['y'])
					),
				'properties' => array(
					'id_estab' => $row['id_estab'],
					'id_tipo' => $row['id_tipo']
					)
			);
			
			array_push($geojson['features'], $feature);
		};
		
		$datos = $geojson;
		
	}else{
		$respuesta = false;
		$datos = null;
	}
	
	$capa = json_encode(array(
		'respuesta' => $respuesta,
		'datos' => $datos
	), JSON_NUMERIC_CHECK);
	
	echo $capa;
?>