<?php 
	require_once('funciones.php');
	
	$id_estab = isset($_POST['id_estab']) ? validacion_numero($_POST['id_estab']) : null;
	
	if($id_estab == null){
		
		$respuesta = false;
		$mensaje = "parametro invalido o nulo";
		$datos = null;
		
	}else{
		
		$mysqli = new mysqli($HOST, $USER, $PASSWORD, $BD);
	
		if ($mysqli->connect_error){
			die('Error de Conexión');};
		
		$mysqli -> set_charset('utf8');
		
		$sentencia = file_get_contents('sql/consulta_codigo_establecimiento.sql');
		
		$consulta = $mysqli -> prepare($sentencia);
		
		$consulta -> bind_param("i", $id_estab);
		
		$consulta -> execute();
		
		if($consulta){
			$consulta -> bind_result($nombre, $tipo_estab, $asic,
			$municipio, $parroquia, $direccion, $cod_foto);
			
			$consulta -> fetch();
			
			$divImag = "<div class='row justify-content-center'><img class='estab' src='%s' alt='fachada'></div>";
			
			$html = file_get_contents('html/tabla_establecimiento.html');
			
			$html = sprintf($html, $nombre, $asic, $tipo_estab,
			$municipio, $parroquia, $direccion);
			
			if($cod_foto != null){
				$url_foto = 'public/fotos_estab/%s';
				$url_foto = sprintf($url_foto, $cod_foto);
				$html .= sprintf($divImag, $url_foto);
			}
			
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