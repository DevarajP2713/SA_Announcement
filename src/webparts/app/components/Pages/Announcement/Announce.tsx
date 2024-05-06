/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  filAnnounce,
  isAddEditDialogFun,
  isDeleteDialogFun,
  isViewDialogFun,
  masAnnounce,
  selAnnounce,
  setIsLoader,
} from "../../Redux/Reducer/AnnouncementReducer";
import "./Announce.css";
import {
  Button,
  Dialog,
  OrderList,
} from "../../PrimeReactComponent/primereactComponents";
import AddAndEditAnnounce from "./AddAndEditAnnounce";
import ViewAnnounce from "./ViewAnnounce";
import SPServices from "../../CommonServices/SPServices";
import { AppConfig } from "../../Config/AppConfig";
import {
  IAnnounceJSON,
  IAnnounceListColumns,
  IAttachObj,
} from "../../Interfaces/ISAAInterface";
import * as moment from "moment";
import CommonFun from "../../CommonFunctions/CommonFun";
import { sp } from "@pnp/sp/presets/all";
import Loader from "../../Loader/loader";

const dragIcon = require("../../../assets/svg/dragIcon.svg");

const Announce = (): JSX.Element => {
  // useDispatch creation
  const dispatch = useDispatch();

  // useSelector creation
  const isAddEditDialog: boolean = useSelector(
    (state: any) => state.AnnounceDatas.isAddAndEditDialog
  );
  const isViewDialog: boolean = useSelector(
    (state: any) => state.AnnounceDatas.isViewDialog
  );
  const isDeleteDialog: boolean = useSelector(
    (state: any) => state.AnnounceDatas.isDeleteDialog
  );
  const arrAnnounceData: IAnnounceJSON[] = useSelector(
    (state: any) => state.AnnounceDatas.arrFilAnnounce
  );
  const arrMasAnnounceData: IAnnounceJSON[] = useSelector(
    (state: any) => state.AnnounceDatas.arrAnnounce
  );
  const curAnnounceData: IAnnounceJSON = useSelector(
    (state: any) => state.AnnounceDatas.curAnnounce
  );
  const isLoader: boolean = useSelector(
    (state: any) => state.AnnounceDatas.isLoader
  );

  // Functions creation
  const _itemTemplate = (val: IAnnounceJSON): JSX.Element => {
    return (
      <div className="AnnounceItems">
        <img
          src={
            val.Attachments.length ? val?.Attachments[0].ServerRelativeUrl : ""
          }
        />

        <div>
          <div className="description">{val?.Description}</div>
          <div className="footerBottom">
            <div className="date">
              {moment(val?.StartDate).format("MM/DD/YYYY")} -{" "}
              {moment(val?.EndDate).format("MM/DD/YYYY")}
            </div>
            <div className="actionIcons">
              <i
                className="pi pi-eye"
                onClick={() => {
                  dispatch(selAnnounce(val));
                  dispatch(isViewDialogFun(true));
                }}
              />
              <i
                className="pi pi-pencil"
                onClick={() => {
                  dispatch(selAnnounce(val));
                  dispatch(isAddEditDialogFun(true));
                }}
              />
              <i
                className="pi pi-trash"
                onClick={() => {
                  dispatch(selAnnounce(val));
                  dispatch(isDeleteDialogFun(true));
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <img src={dragIcon} alt="drag this section" />
        </div>
      </div>
    );
  };

  const _bulkUpdateAnnounce = async (
    _arrAnnounce: IAnnounceJSON[],
    type: string
  ) => {
    dispatch(setIsLoader(true));
    let data: any = {};
    const column: IAnnounceListColumns = AppConfig.AnnounceListColumns;
    let _remainderAnnounce: IAnnounceJSON[] = [];
    let _priorityAnnounce: IAnnounceJSON[] = [];

    _remainderAnnounce = await CommonFun._filterReminderData(
      [...arrMasAnnounceData],
      type === "delete" ? [...arrAnnounceData] : [..._arrAnnounce],
      type === "delete" ? [..._arrAnnounce] : [],
      type === "delete" ? type : ""
    );

    _priorityAnnounce = _remainderAnnounce.map(
      (val: IAnnounceJSON, i: number) => ({
        ...val,
        Priority: i + 1,
      })
    );

    for (let i: number = 0; _priorityAnnounce.length > i; i++) {
      data[column.Priority] = Number(_priorityAnnounce[i].Priority);

      await sp.web.lists
        .getByTitle(AppConfig.ListNames.Announcement)
        .items.getById(Number(_priorityAnnounce[i].ID))
        .update({ ...data })
        .then(async (res: any) => {
          if (_priorityAnnounce.length === i + 1) {
            let _sortingRecords: IAnnounceJSON[] = CommonFun._filCurrentData([
              ..._priorityAnnounce,
            ]);
            let _remainMaster: IAnnounceJSON[] =
              type === "delete"
                ? arrMasAnnounceData.filter(
                    (val: IAnnounceJSON) => val.ID !== _arrAnnounce[0].ID
                  )
                : [...arrMasAnnounceData];

            dispatch(masAnnounce([..._remainMaster]));
            dispatch(filAnnounce([..._sortingRecords]));
            dispatch(setIsLoader(false));
          }
        })
        .catch((err: any) => {
          console.log("err: ", err);
          dispatch(masAnnounce([]));
          dispatch(filAnnounce([]));
          dispatch(setIsLoader(false));
        });
    }
  };

  const _deleteRecord = (): void => {
    let data: any = {};
    const column: IAnnounceListColumns = AppConfig.AnnounceListColumns;

    data[column.IsDelete] = true;

    SPServices.SPUpdateItem({
      Listname: AppConfig.ListNames.Announcement,
      ID: Number(curAnnounceData.ID),
      RequestJSON: { ...data },
    })
      .then(async (res: any) => {
        dispatch(isDeleteDialogFun(false));
        dispatch(setIsLoader(true));
        await _bulkUpdateAnnounce([{ ...curAnnounceData }], "delete");
      })
      .catch((err: any) => {
        console.log("err: ", err);
        dispatch(isDeleteDialogFun(false));
      });
  };

  const _getAnnouncementDatas = (): void => {
    SPServices.SPReadItems({
      Listname: AppConfig.ListNames.Announcement,
      Select: "*, AttachmentFiles",
      Expand: "AttachmentFiles",
      Filter: [
        {
          FilterKey: "IsDelete",
          FilterValue: "1",
          Operator: "ne",
        },
        {
          FilterKey: "IsArchive",
          FilterValue: "1",
          Operator: "ne",
        },
      ],
      Topcount: 5000,
    })
      .then((res: any) => {
        let _arrDatas: IAnnounceJSON[] = [];

        res?.forEach((data: any) => {
          let _objAttach: IAttachObj = data?.AttachmentFiles.length && {
            name: data?.AttachmentFiles[0]?.FileName,
            content: [],
            ServerRelativeUrl:
              window.location.origin +
              data?.AttachmentFiles[0]?.ServerRelativeUrl,
          };

          _arrDatas.push({
            ID: data?.ID,
            Attachments: _objAttach?.name ? [{ ..._objAttach }] : [],
            Description: data?.Description || "",
            Priority: data?.Priority || "",
            StartDate: data.StartDate ? new Date(data.StartDate) : null,
            EndDate: data.EndDate ? new Date(data.EndDate) : null,
            IsArchive: data?.IsArchive || false,
            IsDelete: data?.IsDelete || false,
          });
        });

        let _sortCurAnnounce: IAnnounceJSON[] = CommonFun._sortingArray([
          ..._arrDatas,
        ]);
        let _filCurAnnounce: IAnnounceJSON[] = CommonFun._filCurrentData([
          ..._sortCurAnnounce,
        ]);

        dispatch(masAnnounce([..._sortCurAnnounce]));
        dispatch(filAnnounce([..._filCurAnnounce]));
        dispatch(setIsLoader(false));
      })
      .catch((err: any) => {
        console.log("err: ", err);
        dispatch(setIsLoader(false));
      });
  };

  const _getDefaultFun = (): void => {
    dispatch(setIsLoader(true));
    _getAnnouncementDatas();
  };

  useEffect(() => {
    _getDefaultFun();
  }, []);

  return (
    <>
      {isLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "calc(100vh - 70px)",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div>
          {/* Header section */}
          <div className="AnnounceHeader">
            <div>Announcement</div>
            <Button
              icon="pi pi-plus"
              label="Add new"
              onClick={() => {
                dispatch(isAddEditDialogFun(true));
              }}
            />
          </div>

          {/* Body section */}
          <div>
            <OrderList
              dataKey="OrderData"
              value={[...arrAnnounceData]}
              itemTemplate={_itemTemplate}
              onChange={async (e) => {
                await _bulkUpdateAnnounce(e.value, "");
              }}
              dragdrop
            />
          </div>

          {/* Add and Delete dialog section */}
          <Dialog
            visible={isAddEditDialog}
            onHide={() => {
              dispatch(isAddEditDialogFun(true));
            }}
            className="DialogBox"
            showHeader={false}
          >
            <AddAndEditAnnounce />
          </Dialog>

          {/* View dialog section */}
          <Dialog
            visible={isViewDialog}
            onHide={() => {
              dispatch(isViewDialogFun(true));
            }}
            className="DialogBox"
            showHeader={false}
          >
            <ViewAnnounce />
          </Dialog>

          {/* Delete dialog section */}
          <Dialog
            visible={isDeleteDialog}
            onHide={() => {
              dispatch(isDeleteDialogFun(true));
            }}
            className="DialogBox"
            style={{
              paddingBottom: "10px !important",
            }}
            showHeader={false}
          >
            <div className="deleteContainer">
              <h3>Delete Confirmation</h3>
              <div>
                <i className="pi pi-info-circle" />
                <div>Do you want to delete this record?</div>
              </div>
              <div
                style={{
                  marginBottom: "-10px",
                }}
              >
                <Button
                  label="No"
                  className="secondaryBtnSM"
                  onClick={() => {
                    dispatch(isDeleteDialogFun(false));
                  }}
                />
                <Button
                  label="Yes"
                  className="primaryBtnSM"
                  onClick={() => {
                    _deleteRecord();
                  }}
                />
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Announce;
