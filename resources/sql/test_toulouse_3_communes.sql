--
-- import test_communes_agglo_toulouse.csv > TABLE xx
-- import test_communes_agglo_toulouse.shp > TABLE yy
--

-- TODO : rename TABLE xx and TABLE yy to their real names given by the import procedure (e.g. from within phpmyadmin)
RENAME TABLE `TABLE 17` TO mes_communes_csv;
RENAME TABLE `TABLE 18` TO mes_communes_shp;
-- add an index, named id, to each newly created table which will allow to join spatial data with attributes
ALTER TABLE mes_communes_csv ADD `id` SERIAL NOT NULL;
ALTER TABLE mes_communes_shp ADD `id` SERIAL NOT NULL;

INSERT INTO `commune`(`id_commune`, `lib_commune`, `geom_commune`) SELECT mes_communes_csv.insee, mes_communes_csv.nom, mes_communes_shp .`SPATIAL` FROM mes_communes_shp  INNER JOIN mes_communes_csv WHERE mes_communes_csv.id =mes_communes_shp.id;

