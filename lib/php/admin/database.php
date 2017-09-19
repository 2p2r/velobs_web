<?php
	session_start();
	include 'adminfunction.php';

	if (isset($_SESSION['user'])) {
		$task = '';
		if (isset($_POST['task'])) {
			$task = $_POST['task'];
			$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
			$end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
			$query = $_POST['query'];
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
				if (isset($query)) {
					if ($query != '') {
						if (strlen($query) >= 3) {
							findPoi($query);
						} else {
							break;
						}
					} else {
						getPoi(0,200, 'default', 0, 0);
					}
				} else if (isset($_POST['sort']) && isset($_POST['dir'])) {
                    getPoi($start, $end, $asc, $sort, $dir);
				} else {
				    getPoi($start, $end, $asc, 0, 0);
				}
				break;
		    case "LISTINGPOIPOLEASSO":
                if (isset($query)) {
                    if ($query != '') {
                        if (strlen($query) >= 3) {
                            findPoiGT($query);
                        } else {
                            break;
                        }
                    } else {
                        getPoiComcomPole(0,200, 'default', 0, 0);
                    }
                } else if (isset($_POST['sort']) && isset($_POST['dir'])) {
                    getPoiComcomPole($start, $end, $asc, $sort, $dir);
                } else {
                    getPoiComcomPole($start, $end, $asc, 0, 0);
                }
                break;
			case "LISTINGPOIBASKET":
				if (isset($query)) {
					if ($query != '') {
						if (strlen($query) >= 3) {
							findPoiBasket($query);
						} else {
							break;
						}
					} else {
						getPoiBasket(0,200, 'default');
					}
				} else {
					getPoiBasket($start, $end, $asc);
				}
				break;
			case "LISTINGPOIBASKETPOLE":
                if (isset($query)) {
                    if ($query != '') {
                        if (strlen($query) >= 3) {
                            findPoiBasket($query);
                        } else {
                            break;
                        }
                    } else {
                        getPoiBasketPole(0,200, 'default');
                    }
                } else {
                    getPoiBasketPole($start, $end, $asc);
                }
                break;
			case "LISTINGPOICOM":
				if (isset($query)) {
					if ($query != '') {
						if (strlen($query) >= 3) {
							findPoiGT($query);
						} else {
							break;
						}
					} else {
						getPoiComcom(0,200, 'default');
					}
				} else if (isset($_POST['sort']) && isset($_POST['dir'])) {
				    getPoiComcom($start, $end, $asc, $sort, $dir);
				} else {
					getPoiComcom($start, $end, $asc, 0, 0);
				}
				break;
			case "LISTINGPOIPOLECOM":
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - LISTINGPOIPOLECOM ".$_POST." \n", 3, LOG_FILE);
				}
				if (isset($query)) {
					if ($query != '') {
						if (strlen($query) >= 3) {
							findPoiPole($query);
						} else {
							break;
						}
					} else {
						getPoiPole(0,200, 'default', $_SESSION['pole'], 0, 0);
					}
				} else if (isset($_POST['sort']) && isset($_POST['dir'])) {
					getPoiPole($start, $end, $asc, $_SESSION['pole'], $sort, $dir);
				} else {
                    getPoiPole($start, $end, $asc, $_SESSION['pole'], 0, 0);
				}
				break;
			case "UPDATEPOI":
				updatePoi();
				break;
            case "UPDATEPOICOMCOMCARTO":
                updatePoiComcomCarto();
                break;
            case "UPDATEPOIPOLETECHCARTO":
                updatePoiPoleTechCarto();
                break;
            case "UPDATEASSOPOLECARTOPOI":
                updateAssoPoleCartoPoi();
                break;
            case "UPDATEADMINPOI":
                updateAdminPoi();
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
                if ($_SESSION['role'] == 2 || $_SESSION['role'] == 3) {
                     createPublicComment($_POST['id_poi'],$_POST['text_comment']);
                } else {
                     createPublicCommentSession($_POST['id_poi'],$_POST['text_comment']);
                }
                break;


            case "LISTINGPHOTOS":
                getPhotos($id_poi);
                break;
            case "LISTINGPHOTOSCOM":
                getPhotosCom($id_poi);
                break;
            case "UPDATEPHOTOS":
                displayPhoto($_POST['id_photo'],$_POST['display_photo']);
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
                createPublicComment($_POST['id_poi'],$_POST['text_comment']);
                break;
		}
	}
?>
