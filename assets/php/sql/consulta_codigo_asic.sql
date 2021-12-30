SELECT
UPPER(a.nombre) AS nombre,
UPPER(a.limite_norte) AS limite_norte,
UPPER(a.limite_sur) AS limite_sur,
UPPER(a.limite_este) AS limite_este,
UPPER(a.limite_oeste) AS limite_oeste,
GROUP_CONCAT(UPPER(m.municipio) ORDER BY m.municipio desc) AS municipios,
GROUP_CONCAT(UPPER(p.parroquia) ORDER BY p.parroquia desc) AS parroquias,
a.cobertura_mun AS cobertura_mun
FROM asic AS a
LEFT JOIN rel_asic_parr AS r
ON r.cod_asic = a.cod_asic
LEFT JOIN parroquias AS p
ON p.cod_parr = r.cod_parr
LEFT JOIN municipios AS m
ON m.cod_mun = p.cod_mun
WHERE a.cod_asic = ?
GROUP BY a.cod_asic
