<?php
	require_once('funciones.php');
	
	$mysqli = new mysqli($HOST, $USER, $PASSWORD, $BD);
	
	if ($mysqli->connect_error){
		die('Error de Conexión');};
	
	$mysqli -> set_charset('utf8');
	
	$sentencia = file_get_contents('sql/consulta_listado_asic.sql');
	
	$consulta = $mysqli -> query($sentencia);
	
	if($consulta){
		$respuesta = true;
		$opciones = "";
	
		while ($row = $consulta -> fetch_assoc()){
			$option = "<option value='%s' data-codigo='%s'>";
			$opciones .= sprintf($option, 
				$row['nombre'], $row['cod_asic']
			);
			
		}
	}else{
		$respuesta = false;
		$opciones = null;
	}
	
	$mysqli -> close();
	
	echo json_encode(array(
		'respuesta' => $respuesta,
		'datos' => $opciones
	), JSON_NUMERIC_CHECK);
?>