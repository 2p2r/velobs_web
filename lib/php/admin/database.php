<?php
session_start ();
include_once 'adminfunction.php';
if (DEBUG) {
	error_log ( date ( "Y-m-d H:i:s" ) . " " . __FUNCTION__ . " - dans database.php \n", 3, LOG_FILE );
}

if (isset ( $_SESSION ['user'] )) {
	$task = '';
	if (isset ( $_POST ['task'] )) {
		$task = $_POST ['task'];
		
		if (isset ( $_POST ['start'] )) {
			$start = $_POST ['start'];
		}
		if (isset ( $_POST ['limit'] )) {
			$limit = $_POST ['limit'];
		}
		$asc = 'DESC';
		if (isset ( $_POST ['asc'] )) {
			$asc = $_POST ['asc'];
		}
		if (isset ( $_POST ['usertype'] )) {
			$usertype = $_POST ['usertype'];
		}
		if (isset ( $_POST ['numRecordPerPage'] )) {
			$numRecordPerPage = $_POST ['numRecordPerPage'];
		}
		if (isset ( $_POST ['idToFind'] )) {
			$idToFind = $_POST ['idToFind'];
		}
		
		if (isset ( $_POST ['sort'] ) && isset ( $_POST ['dir'] )) {
			$sort = $_POST ['sort'];
			$dir = $_POST ['dir'];
		}
		
		if (isset ( $_POST ['id_poi'] )) {
			$id_poi = $_POST ['id_poi'];
		}
	}
	if (DEBUG) {
		error_log ( date ( "Y-m-d H:i:s" ) . " " . __FUNCTION__ . " - dans database.php, task = $task \n", 3, LOG_FILE );
	}
	switch ($task) {
		case "LISTINGICO" :
			getMarkerIcon ( $start, $limit );
			break;
		case "UPDATEICO" :
			updateMarkerIcon ();
			break;
		/*
		 * case "DELETEICO": deleteIcons(); break;
		 */
		
		case "LISTINGCAT" :
			getCategory ( $start, $limit );
			break;
		case "UPDATECAT" :
			updateCategory ();
			break;
		case "CREATECAT" :
			createCategory ();
			break;
		case "DELETECAT" :
			deleteCategorys ();
			break;
		
		case "LISTINGSUBCAT" :
			getSubCategory ( $start, $limit );
			break;
		case "UPDATESUBCAT" :
			updateSubCategory ();
			break;
		case "CREATESUBCAT" :
			createSubCategory ();
			break;
		case "DELETESUBCAT" :
			deleteSubCategorys ();
			break;
		
		case "LISTINGPOI" :
			if (isset ( $_POST ['sort'] ) && isset ( $_POST ['dir'] )) {
				getPoi ( $start, $limit, $asc, $sort, $dir );
			} else {
				getPoi ( $start, $limit, $asc, 0, 0 );
			}
			break;
		case "UPDATEPOI" :
			updatePoi ();
			break;
		case "CREATEPOI" :
			createPoi ();
			break;
		case "DELETEPOI" :
			// deletePois();
			deletePoisCorbeille ();
			break;
		
		case "LISTINGCITY" :
			getCommune ( $start, $limit );
			break;
		case "UPDATECITY" :
			updateCommune ();
			break;
		case "CREATECITY" :
			createCommune ();
			break;
		case "DELETECITY" :
			deleteCommunes ();
			break;
		
		case "LISTINGPOLE" :
			getPole ( $start, $limit );
			break;
		case "UPDATEPOLE" :
			updatePole ();
			break;
		case "CREATEPOLE" :
			createPole ();
			break;
		case "DELETEPOLE" :
			deletePoles ();
			break;
		
		case "LISTINGQUARTIER" :
			getQuartier ( $start, $limit );
			break;
		case "UPDATEQUARTIER" :
			updateQuartier ();
			break;
		case "CREATEQUARTIER" :
			createQuartier ();
			break;
		case "DELETEQUARTIER" :
			deleteQuartiers ();
			break;
		
		case "LISTINGPRIORITE" :
			getPriorite ( $start, $limit );
			break;
		case "UPDATEPRIORITE" :
			updatePriorite ();
			break;
		case "CREATEPRIORITE" :
			createPriorite ();
			break;
		case "DELETEPRIORITE" :
			deletePriorites ();
			break;
		
		case "LISTINGSTATUS" :
			getStatus ( $start, $limit );
			break;
		case "UPDATESTATUS" :
			updateStatus ();
			break;
		case "CREATESTATUS" :
			createStatus ();
			break;
		case "DELETESTATUS" :
			deleteStatuss ();
			break;
		
		case "RESETPHOTOPOI" :
			resetPhotoPoi ();
			break;
		
		case "ISMODERATE" :
			isModerate ();
			break;
		
		// case "UPDATEGEOPOI":
		// updateGeoPoi();
		// break;
		case "RESETGEOPOI" :
			resetGeoPoi ();
			break;
		
		case "UPDATEGEODEFAULTMAP" :
			updateGeoDefaultMap ();
			break;
		
		case "CREATEPUBLICPOI" :
			createPublicPoi ();
			break;
		
		case "ISPROPPUBLIC" :
			isPropPublic ();
			break;
		case "GETUSER" :
			getUser ();
			break;
		case "LISTINGUSER" :
			getUsers ( $start, $limit );
			break;
		case "UPDATEUSER" :
			updateUser ();
			break;
		case "RESETPASSWORD" :
			resetUserPassword ();
			break;
		case "CREATEUSER" :
			createUser ();
			break;
		case "DELETEUSER" :
			deleteUsers ();
			break;
		
		case "GETNUMPAGEIDPARAM" :
			getNumPageIdParam ( $idToFind, $usertype, $numRecordPerPage );
			break;
		
		case "LISTINGCOMMENTS" :
			getComments ( $id_poi );
			break;
		case "EDITCOMMENTS" :
			editComment ( $_POST ['id_comment'], $_POST ['text_comment'], $_POST ['display_commentaires'] );
			break;
		case "CREATEPUBLICCOMMENTS" :
			createPublicComment ();
			break;
		case "LISTINGPHOTOS" :
			getComments ( $id_poi );
			break;
		case "UPDATEPHOTOS" :
			// displayPhoto($_POST['id_photo'],$_POST['display_photo']);
			break;
		
		default :
			echo "{failure:true}";
			break;
	}
} else {
	$task = $_POST ['task'];
	switch ($task) {
		case "CREATEPUBLICPOI" :
			createPublicPoi ();
			break;
		case "CREATEPUBLICCOMMENTS" :
			createPublicComment ();
			break;
	}
}
?>
