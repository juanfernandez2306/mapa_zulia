<?php 
	
	$HOST = 'localhost';
	$USER = 'root';
	$PASSWORD = '';
	$BD = 'mapa_zulia';
	
	function validacion_texto($input, $maximaLongitud){
		if (trim($input) == "" or $input == null){
			
			return null;
			
		}else if (strlen($input) > $maximaLongitud){
			
			return null;
			
		}else{
			
			return strtolower($input);
			
		}
	}
	
	function validacion_numero($input){
		if (is_numeric($input)){
			
			return (int)$input;
			
		}else{
			
			return null;
			
		}
	}
	
	function validacion_numero_float($input){
		if (is_numeric($input)){
			
			return (float)$input;
			
		}else{
			
			return null;
			
		}
	}
	
	function validacion_fecha($input){
		$patron = "/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/";
		$comprobacion = preg_match($patron, $input);
		
		if ($comprobacion){
			
			$valores = explode("-", $input);
			$validarFecha = checkdate(
				$valores[1],
				$valores[2],
				$valores[0]
				);
			
			if ($validarFecha){
				
				return $input;
				
			}else{
				
				return null;
				
			}
			
		}else{
			
			return null;
			
		}
		
	}
	
	function validacion_mes($input){
		$patron = "/^[0-9]{4}-[0-9]{2}$/";
		$comprobacion = preg_match($patron, $input);
		
		if ($comprobacion){
			
			$valores = explode("-", $input);
			
			return array(
				'year' => (int)$valores[0],
				'month' => (int)$valores[1]
			);
			
		}else{
			
			return null;
			
		}
		
	}
	
	function validacion_codigo_numero($input){
		if (is_numeric($input)){
			
			$input = (int)$input;
			
			if ($input == -1){
				
				return null;
				
			}else{
				
				return $input;
				
			}
			
		}else{
			
			return null;
			
		}
	}
	
	function validacion_sexo($input){
		$input = validacion_texto($input, 1);
		
		if ($input != null){
			if ($input == 'm' or $input == 'f'){
				
				return $input;
				
			}
		}else{
			
			return null;
			
		}
	}
	
	function validacion_resultado($input){
		$input = validacion_texto($input, 1);
		
		if ($input != null){
			if ($input == 'p' or $input == 'n'){
				
				return $input;
				
			}
		}else{
			
			return null;
			
		}
	}
	
	function retornar_datos_nulos($datos){
		if ($datos == null){
			return true;
		}
	}
	
	function retornar_datos($datos){
		if ($datos != null){
			return $datos;
		}
	}
	
	function consultar_similitud($elemento_consulta, $parametros, $url_sentencia){
		/*
			La variable parametros esta compuesta de de dos elementos
			array(
				'clasif' => string de la clasificacion del elemento, pensando inicialmente en municipios o tipo de productos,
				'elemento' => string con el nombre del elemento a buscar en la base de datos
			);
		*/
		global $url;
		
		$mysqli = new mysqli($url[0], $url[1], $url[2], $url[3]);
	
		if ($mysqli->connect_error){
			die('Error de Conexión');
		};
		
		$sentencia = file_get_contents($url_sentencia);
		$consulta = $mysqli -> query($sentencia);
		$stop_words = array('de', 'los', 'la', 'el', 'del', 'dr', '-');
		
		$array_elem = explode(' ', $elemento_consulta);
		$dep_array_elem = array_diff($array_elem, $stop_words);
		sort($dep_array_elem);
		$text_elem = implode(' ', $dep_array_elem);
		$count_text_elem = strlen($text_elem);
		$datos = array();
		
		$simbolos = array(',', '(', ')', '-');
		
		$condicion = false;
		
		while ($row = $consulta -> fetch_assoc()){
			$elemento_bd = $row[$parametros['elemento']];
			$array_elem_bd = explode(' ', $elemento_bd);
			$dep_array_elem_bd = array_diff($array_elem_bd, $stop_words);
			sort($dep_array_elem_bd);
			$text_elem_bd = implode(' ', $dep_array_elem_bd);
			$text_elem_bd = str_replace($simbolos, '', $text_elem_bd);
			$count_text_elem_bd = strlen($text_elem_bd);
			$total = ($count_text_elem + $count_text_elem_bd) / 2;
			$coef_similar_text = levenshtein($text_elem, $text_elem_bd) / $total;
			
			if ($coef_similar_text <= 0.05){
				$condicion = true;
				$datos = array();
				break;
			}else if($coef_similar_text <= 0.4){
				$condicion = true;
				array_push($datos, 
					array(
						$parametros['clasif'] => strtoupper($row[$parametros['clasif']]),
						$parametros['elemento'] => strtoupper($elemento_bd),
						'coef' => round($coef_similar_text, 1)
					)
				);
			}
			
			
		}
		
		#cerrar base de datos
		$mysqli -> close();
		
		return array(
			'respuesta' => $condicion,
			'datos' => $datos
		);
		
	}
?>