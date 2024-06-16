import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sp } from "@pnp/sp/presets/all";
import {
  filAnnounce,
  isAddEditDialogFun,
  masAnnounce,
  selAnnounce,
  setIsLoader,
} from "../../Redux/Reducer/AnnouncementReducer";
import DragDropFile from "../../CommonFunctions/DragDropFile";
import {
  IAnnounceJSON,
  IAnnounceListColumns,
  IAttachments,
} from "../../Interfaces/ISAAInterface";
import { AppConfig } from "../../Config/AppConfig";
import {
  Button,
  Calendar,
  InputText,
  InputTextarea,
} from "../../PrimeReactComponent/primereactComponents";
// import SPServices from "../../CommonServices/SPServices";
import CommonFun from "../../CommonFunctions/CommonFun";
import * as moment from "moment";

let _arrAnnounce: IAnnounceJSON[] = [];
let _priorityAnnounce: IAnnounceJSON[] = [];
let _imgName: string = "";

const AddAndEditAnnounce = (): JSX.Element => {
  // useDispatch creation
  const dispatch = useDispatch();

  // useSelector creation
  const curAnnounceData: IAnnounceJSON = useSelector(
    (state: any) => state.AnnounceDatas.curAnnounce
  );
  const masArrayAnnounceData: IAnnounceJSON[] = useSelector(
    (state: any) => state.AnnounceDatas.arrAnnounce
  );
  const arrAnnounceData: IAnnounceJSON[] = useSelector(
    (state: any) => state.AnnounceDatas.arrFilAnnounce
  );

  // State creation
  const [imgFile, setImgFile] = useState<IAttachments>({
    ...AppConfig.LibraryData,
  });
  const [curData, setCurData] = useState<IAnnounceJSON>({
    ...AppConfig.AnnounceJSON,
  });
  const [isValidation, setIsValidation] = useState<boolean>(false);
  const [isPriorityValid, setIsPriorityValid] = useState<boolean>(false);

  // Functions creation
  const _dialogCloseFun = (): void => {
    setCurData({ ...AppConfig.AnnounceJSON });
    dispatch(selAnnounce({ ...AppConfig.AnnounceJSON }));
    dispatch(isAddEditDialogFun(false));
    dispatch(setIsLoader(false));
  };

  const _sortingFun = (): void => {
    let _curFilData: IAnnounceJSON[] =
      CommonFun._filCurrentData(_priorityAnnounce);
    dispatch(masAnnounce([..._priorityAnnounce]));
    dispatch(filAnnounce([..._curFilData]));
    _dialogCloseFun();
  };

  const _bulkUpdateAnnounce = async () => {
    let data: any = {};
    const column: IAnnounceListColumns = AppConfig.AnnounceListColumns;

    if (_priorityAnnounce.length) {
      for (let i: number = 0; _priorityAnnounce.length > i; i++) {
        data[column.Priority] = Number(_priorityAnnounce[i].Priority);

        await sp.web.lists
          .getByTitle(AppConfig.ListNames.Announcements)
          .items.getById(Number(_priorityAnnounce[i].ID))
          .update({ ...data })
          .then(async (res: any) => {
            if (_priorityAnnounce.length === i + 1) {
              _sortingFun();
            }
          })
          .catch((err: any) => {
            console.log("err: ", err);
            _dialogCloseFun();
          });
      }
    } else {
      _dialogCloseFun();
    }
  };

  const _arrangedDatas = async (type: string, Id: number) => {
    // Workbench path value
    let _curPageURL: string = `${window.location.origin}${AppConfig.SitePath.sitePath}${AppConfig.ListNames.Announcements}/${_imgName}`;

    let _curJSON: IAnnounceJSON = {
      ID: Id,
      Description: curData.Description,
      EndDate: new Date(curData.EndDate),
      StartDate: new Date(curData.StartDate),
      Priority: curData.Priority,
      IsArchive: curData?.IsArchive || false,
      IsDelete: curData?.IsDelete || false,
      Attachments: [
        {
          name: imgFile.content.length
            ? imgFile.content[0].name
            : curData.Attachments.length !== 0
            ? curData.Attachments[0].name
            : "",
          content: imgFile.content.length
            ? imgFile?.content
            : curData.Attachments.length !== 0
            ? curData.Attachments[0].content
            : [],
          ServerRelativeUrl: imgFile.content.length
            ? _curPageURL
            : curData.Attachments.length !== 0
            ? curData.Attachments[0].ServerRelativeUrl
            : "",
        },
      ],
    };

    let _isAnnounce: boolean = false;
    let _isMasAnnounce: boolean = false;
    let _delArrAnnounce: IAnnounceJSON[] = [];
    let _delMasAnnounce: IAnnounceJSON[] = [];
    let _selJSON: IAnnounceJSON = { ...curAnnounceData };

    if (type === "delete") {
      for (let i: number = 0; arrAnnounceData.length > i; i++) {
        if (curData.ID === arrAnnounceData[i].ID) {
          _delArrAnnounce.push({ ..._curJSON });
        } else {
          _delArrAnnounce.push({ ...arrAnnounceData[i] });
        }

        if (arrAnnounceData.length === _delArrAnnounce.length) {
          _isAnnounce = true;
        }
      }

      for (let i: number = 0; masArrayAnnounceData.length > i; i++) {
        if (curData.ID === masArrayAnnounceData[i].ID) {
          _delMasAnnounce.push({ ..._curJSON });
        } else {
          _delMasAnnounce.push({ ...masArrayAnnounceData[i] });
        }

        if (masArrayAnnounceData.length === _delMasAnnounce.length) {
          _isMasAnnounce = true;
        }
      }
    } else {
      _delArrAnnounce = [...arrAnnounceData];
      _delMasAnnounce = [...masArrayAnnounceData];
      _isAnnounce = true;
      _isMasAnnounce = true;
    }

    if (_isAnnounce && _isMasAnnounce) {
      _arrAnnounce = CommonFun._newAndEditAnnouncePrepare(
        { ..._curJSON },
        [..._delArrAnnounce],
        [..._delMasAnnounce],
        { ..._selJSON },
        type
      );

      _priorityAnnounce = await _arrAnnounce.map(
        (val: IAnnounceJSON, i: number) => ({
          ...val,
          Priority: i + 1,
        })
      );

      await _bulkUpdateAnnounce();
    }
  };

  const _updateAnnouncement = async (data: any, attachData: any) => {
    let _libPath: string = `${AppConfig.SitePath.sitePath}${AppConfig.ListNames.Announcements}`;
    let fileAddResult: any;
    let listItem: any;

    const libraryFolder: any = await sp.web.getFolderByServerRelativeUrl(
      _libPath
    );

    if (attachData.Attachments[0].content.length) {
      _imgName = `${
        attachData?.Attachments[0]?.name.split(".")[0]
      }_${moment().format("YYYYMMDDhhmmss")}.${
        attachData?.Attachments[0]?.name.split(".")[1]
      }`;

      await libraryFolder.files
        .getByName(curData?.Attachments[0]?.name)
        .delete();

      fileAddResult = await libraryFolder.files.add(
        _imgName,
        attachData?.Attachments[0]?.content[0],
        true
      );

      listItem = await fileAddResult.file.getItem();

      delete data.ID;

      await listItem
        .update({ ...data })
        .then(async (res: any) => {
          await _arrangedDatas("delete", Number(listItem.ID));
        })
        .catch((err: any) => {
          console.log("err: ", err);
          _dialogCloseFun();
        });
    } else {
      await sp.web.lists
        .getByTitle(AppConfig.ListNames.Announcements)
        .items.getById(data.ID)
        .update({ ...data })
        .then(async (res: any) => {
          await _arrangedDatas("", Number(curData.ID));
        })
        .catch((err: any) => {
          console.log("err: ", err);
          _dialogCloseFun();
        });
    }
  };

  const _addAnnouncement = async (_data: any, attachData: any) => {
    _imgName = `${
      attachData?.Attachments[0]?.name.split(".")[0]
    }_${moment().format("YYYYMMDDhhmmss")}.${
      attachData?.Attachments[0]?.name.split(".")[1]
    }`;

    await sp.web
      .getFolderByServerRelativePath(AppConfig.ListNames.Announcements)
      .files.expand("ListItemAllFields")
      .add(_imgName, attachData?.Attachments[0]?.content[0], false)
      .then(async (data: any) => {
        const item = await data.file.getItem();
        const itemId = item.Id;

        await data.file
          .expand("ListItemAllFields")
          .getItem()
          .then(async (item: any) => {
            await item
              .update({ ..._data })
              .then(async (res: any) => {
                await _arrangedDatas("new", Number(itemId));
              })
              .catch((err: any) => {
                console.log("err: ", err);
                _dialogCloseFun();
              });
          })
          .catch((err: any) => {
            console.log("err: ", err);
            _dialogCloseFun();
          });
      })
      .catch((err: any) => {
        console.log("err: ", err);
        _dialogCloseFun();
      });
  };

  const _handleJSON = async () => {
    let announceData: any = {};
    let announceAttach: any = {};
    const column: IAnnounceListColumns = { ...AppConfig.AnnounceListColumns };

    announceData[column.ID] = curData?.ID || null;
    announceData[column.Description] = curData?.Description || "";
    announceData[column.Priority] = Number(curData?.Priority) || null;
    announceData[column.StartDate] = curData?.StartDate.toISOString() || null;
    announceData[column.EndDate] = curData?.EndDate.toISOString() || null;

    announceAttach[column.Attachments] = [
      {
        name: imgFile.content.length
          ? imgFile.content[0].name
          : curData.Attachments.length !== 0
          ? curData.Attachments[0].name
          : "",
        content: imgFile.content.length
          ? imgFile?.content
          : curData.Attachments.length !== 0
          ? curData.Attachments[0].content
          : [],
        ServerRelativeUrl: imgFile.content.length
          ? ""
          : curData.Attachments.length !== 0
          ? curData.Attachments[0].ServerRelativeUrl
          : "",
      },
    ];

    curData.ID
      ? await _updateAnnouncement(announceData, announceAttach)
      : await _addAnnouncement(announceData, announceAttach);
  };

  const _validation = async () => {
    let _isValid: boolean = false;

    if (
      (imgFile?.content[0]?.name || curData?.Attachments.length) &&
      curData?.Description &&
      curData?.Priority &&
      curData?.StartDate &&
      curData?.EndDate
    ) {
      if (
        1 <= Number(curData.Priority) &&
        masArrayAnnounceData.length + 1 >= Number(curData.Priority)
      ) {
        _isValid = true;
        setIsValidation(!_isValid);
        setIsPriorityValid(!_isValid);
      } else {
        setIsValidation(_isValid);
        setIsPriorityValid(!_isValid);
      }
    } else {
      setIsValidation(!_isValid);
    }

    if (_isValid) {
      dispatch(setIsLoader(true));
      await _handleJSON();
    }
  };

  const _getSelectedData = (): void => {
    setIsValidation(false);
    setCurData(
      curAnnounceData ? { ...curAnnounceData } : { ...AppConfig.AnnounceJSON }
    );
  };

  useEffect(() => {
    _imgName = "";
    _getSelectedData();
  }, []);

  return (
    <div className="DialogContainer">
      <div>
        {/* Dialog box header */}
        <div className="DialogHeader">
          {curData.ID ? "Edit" : "New"} announcement
        </div>

        {/* Dialog box body */}
        <div className="DialogBody">
          <div>
            <h4>
              Image upload <span style={{ color: "red" }}>*</span>
            </h4>
            <div>
              <DragDropFile setNewVisitor={setImgFile} newVisitor={imgFile} />
              <div
                style={{
                  margin: 5,
                  textDecorationLine: "underline",
                  color: "#01a95e",
                  fontWeight: "500",
                }}
              >
                <label
                  style={{
                    cursor: !imgFile.content.length ? "pointer" : "not-allowed",
                  }}
                  onClick={(_) => {
                    !imgFile.content.length
                      ? window.open(
                          curData?.Attachments[0].ServerRelativeUrl + "?web=1",
                          "_blank"
                        )
                      : "";
                  }}
                >
                  {imgFile.content.length
                    ? imgFile.content[0].name
                    : curData.Attachments.length !== 0
                    ? curData.Attachments[0].name
                    : ""}
                </label>
              </div>
            </div>
          </div>

          <div>
            <div>
              <h4>
                Description <span style={{ color: "red" }}>*</span>
              </h4>
              <InputTextarea
                style={{
                  width: "100%",
                  minHeight: "92px",
                  maxHeight: "92px",
                  overflowY: "auto",
                }}
                placeholder="Enter a description"
                rows={5}
                autoResize
                value={curData?.Description || ""}
                onChange={(e: any) => {
                  setCurData((prev: IAnnounceJSON) => ({
                    ...prev,
                    Description: e.target.value.trimStart(),
                  }));
                }}
              />
            </div>
            <div>
              <h4>
                Priority
                {" ( "}
                <span style={{ fontSize: "12px" }}>{`Please enter 1 to ${
                  masArrayAnnounceData.length + 1
                }`}</span>
                {" ) "}
                <span style={{ color: "red" }}>*</span>
              </h4>

              <InputText
                style={{
                  width: "100%",
                }}
                placeholder="Enter a priority"
                value={curData?.Priority.toString() || ""}
                onChange={(e: any) => {
                  const re: any = /^[0-9\b]+$/;

                  if (re.test(e.target.value) || e.target.value === "") {
                    setCurData((prev: IAnnounceJSON) => ({
                      ...prev,
                      Priority: e.target.value.trimStart(),
                    }));
                  }
                }}
              />
            </div>
          </div>

          <div>
            <div>
              <h4>
                Start date <span style={{ color: "red" }}>*</span>
              </h4>
              <Calendar
                style={{
                  width: "100%",
                }}
                showIcon
                placeholder="MM/DD/YYYY"
                dateFormat="mm/dd/yy"
                minDate={new Date()}
                maxDate={curData?.EndDate || null}
                value={curData?.StartDate || new Date()}
                onChange={(e: any) => {
                  setCurData((prev: IAnnounceJSON) => ({
                    ...prev,
                    StartDate: e.value,
                  }));
                }}
              />
            </div>
            <div>
              <h4>
                End date <span style={{ color: "red" }}>*</span>
              </h4>
              <Calendar
                style={{
                  width: "100%",
                }}
                showIcon
                placeholder="MM/DD/YYYY"
                dateFormat="mm/dd/yy"
                minDate={new Date()}
                value={curData?.EndDate || null}
                onChange={(e: any) => {
                  setCurData((prev: IAnnounceJSON) => ({
                    ...prev,
                    EndDate: e.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Dialog box footer */}
        <div className="DialogFooter">
          <div className="footerActionBtns">
            <Button
              label="Close"
              className="secondaryBtn"
              onClick={() => {
                setCurData({ ...AppConfig.AnnounceJSON });
                dispatch(selAnnounce({ ...AppConfig.AnnounceJSON }));
                dispatch(isAddEditDialogFun(false));
                dispatch(setIsLoader(false));
              }}
            />

            <Button
              className="primaryBtn"
              label={curData.ID ? "Update" : "Save"}
              onClick={async () => {
                await _validation();
              }}
            />
          </div>
          <div className="redFlag">
            {isValidation
              ? "Please fill in all required fields."
              : isPriorityValid
              ? `Please enter 1 to ${masArrayAnnounceData.length + 1}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAndEditAnnounce;
