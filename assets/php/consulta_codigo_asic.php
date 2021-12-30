<?php 
	require_once('funciones.php');
	
	$cod_asic = isset($_POST['cod_asic']) ? validacion_numero($_POST['cod_asic']) : null;
	
	if($cod_asic == null){
		
		$respuesta = false;
		$mensaje = "parametro invalido o nulo";
		$datos = null;
		
	}else{
		
		$mysqli = new mysqli($HOST, $USER, $PASSWORD, $BD);
	
		if ($mysqli->connect_error){
			die('Error de Conexión');};
		
		$mysqli -> set_charset('utf8');
		
		$sentencia = file_get_contents('sql/consulta_codigo_asic.sql');
		
		$consulta = $mysqli -> prepare($sentencia);
		
		$consulta -> bind_param("i", $cod_asic);
		
		$consulta -> execute();
		
		if($consulta){
			$consulta -> bind_result($nombre, $limite_norte,
			$limite_sur, $limite_este, $limite_oeste, 
			$municipios, $parroquias, $cobertura_mun);
			
			$consulta -> fetch();
			
			$array_mun = explode(',', $municipios);
			$array_mun = array_unique($array_mun);
			$municipios = implode(', ', $array_mun);
			
			$array_parr = explode(',', $parroquias);
			$array_parr = array_unique($array_parr);
			$parroquias = implode(', ', $array_parr);
			
			$th_mun = 'MUNICIPIO';
			$th_parr = 'PARROQUIA';
			
			if(count($array_mun) > 1){
				$th_mun .= 'S';
			}
			
			if(count($array_parr) > 1){
				$th_parr .= 'S';
			}
			
			$class_dnone = '';
			
			if($cobertura_mun == 1){
				$class_dnone = 'd-none';
			}
			
			$html = file_get_contents('html/tabla_asic.html');
			
			$html = sprintf($html, $nombre, $th_mun, $municipios, 
			$class_dnone, $th_parr, $parroquias, $limite_norte, 
			$limite_este, $limite_sur, $limite_oeste);
			
			$respuesta = true;
			$mensaje = null;
			$datos = $html;
			
		}else{
			$respuesta = false;
			$mensaje = null;
			$datos = null;
		}
		
	}
	
	echo json_encode(array(
		'respuesta' => $respuesta,
		'datos' => $datos,
		'mensaje' => $mensaje
	), JSON_NUMERIC_CHECK);
	
?>