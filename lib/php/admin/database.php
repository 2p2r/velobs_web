<?php
	session_start();
	include_once 'adminfunction.php';
	if (DEBUG){
		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - dans database.php \n", 3, LOG_FILE);
	}
	
	if (isset($_SESSION['user'])) {
		$task = '';
		if (isset($_POST['task'])) {
			$task = $_POST['task'];
			$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
			$end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
			$asc = $_POST['asc'];

			$usertype = $_POST['usertype'];
			$numRecordPerPage = $_POST['numRecordPerPage'];
			$idToFind = $_POST['idToFind'];

            if (isset($_POST['sort']) && isset($_POST['dir'])) {
                $sort = $_POST['sort'];
                $dir = $_POST['dir'];
            }

            if (isset($_POST['id_poi'])) {
                $id_poi = $_POST['id_poi'];
            }


		}
		if (DEBUG){
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - dans database.php, task = $task \n", 3, LOG_FILE);
		}
		switch ($task) {
			case "LISTINGICO":
				getMarkerIcon($start, $end);
				break;
			case "UPDATEICO":
				updateMarkerIcon();
				break;
			/*case "DELETEICO":
				deleteIcons();
				break;*/
				
			case "LISTINGCAT":
				getCategory($start, $end);
				break;
			case "UPDATECAT":
				updateCategory();
				break;
			case "CREATECAT":
				createCategory();
				break;
			case "DELETECAT":
				deleteCategorys();
				break;
				
			case "LISTINGSUBCAT":
				getSubCategory($start, $end);
				break;
			case "UPDATESUBCAT":
				updateSubCategory();
				break;
			case "CREATESUBCAT":
				createSubCategory();
				break;
			case "DELETESUBCAT":
				deleteSubCategorys();
				break;
				
			case "LISTINGPOI":
				if (isset($_POST['sort']) && isset($_POST['dir'])) {
                    getPoi($start, $end, $asc, $sort, $dir);
				} else {
				    getPoi($start, $end, $asc, 0, 0);
				}
				break;
			case "UPDATEPOI":
				updatePoi();
				break;
			case "CREATEPOI":
				createPoi();
				break;
			case "DELETEPOI":
				//deletePois();
				deletePoisCorbeille();
				break;		
				
			case "LISTINGCITY":
				getCommune($start, $end);
				break;
			case "UPDATECITY":
				updateCommune();
				break;
			case "CREATECITY":
				createCommune();
				break;
			case "DELETECITY":
				deleteCommunes();
				break;
				
			case "LISTINGPOLE":
				getPole($start, $end);
				break;
			case "UPDATEPOLE":
				updatePole();
				break;
			case "CREATEPOLE":
				createPole();
				break;
			case "DELETEPOLE":
				deletePoles();
				break;
				
			case "LISTINGQUARTIER":
				getQuartier($start, $end);
				break;
			case "UPDATEQUARTIER":
				updateQuartier();
				break;
			case "CREATEQUARTIER":
				createQuartier();
				break;
			case "DELETEQUARTIER":
				deleteQuartiers();
				break;
				
			case "LISTINGPRIORITE":
				getPriorite($start, $end);
				break;
			case "UPDATEPRIORITE":
				updatePriorite();
				break;
			case "CREATEPRIORITE":
				createPriorite();
				break;
			case "DELETEPRIORITE":
				deletePriorites();
				break;
				
			case "LISTINGSTATUS":
				getStatus($start, $end);
				break;
			case "UPDATESTATUS":
				updateStatus();
				break;
			case "CREATESTATUS":
				createStatus();
				break;
			case "DELETESTATUS":
				deleteStatuss();
				break;
				
			case "RESETPHOTOPOI"	:
				resetPhotoPoi();
				break;
				
			case "ISMODERATE":
				isModerate();
				break;

			case "UPDATEGEOPOI":
				updateGeoPoi();
				break;			
			case "RESETGEOPOI":
				resetGeoPoi();
				break;
				
			case "UPDATEGEODEFAULTMAP":
				updateGeoDefaultMap();
				break;

			case "CREATEPUBLICPOI":
			    createPublicPoi();
				break;

			case "ISPROPPUBLIC":
				isPropPublic();
				break;

			case "LISTINGUSER":
                getUser($start, $end);
                break;
            case "UPDATEUSER":
                updateUser();
                break;
            case "CREATEUSER":
                createUser();
                break;
            case "DELETEUSER":
                deleteUsers();
                break;

            case "GETNUMPAGEIDPARAM":
                getNumPageIdParam($idToFind, $usertype, $numRecordPerPage);
                break;

            case "LISTINGCOMMENTS":
                getComments($id_poi);
                break;
            case "UPDATECOMMENTS":
                displayComment($_POST['id_comment'],$_POST['display_comment']);
                break;
            case "EDITCOMMENTS":
                editComment($_POST['id_comment'],$_POST['text_comment']);
                break;
            case "CREATEPUBLICCOMMENTS":
                createPublicComment();
                break;
            case "LISTINGPHOTOS":
                getComments($id_poi);
                break;
            case "UPDATEPHOTOS":
                //displayPhoto($_POST['id_photo'],$_POST['display_photo']);
                break;

				
			default:
				echo "{failure:true}";
				break;
		}
	} else {
		$task = $_POST['task'];
		switch ($task) {
			case "CREATEPUBLICPOI":
				createPublicPoi();
				break;
			case "CREATEPUBLICCOMMENTS":
                createPublicComment();
                break;
		}
	}
?>
