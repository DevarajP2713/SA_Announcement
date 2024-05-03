import * as moment from "moment";
import { IAnnounceJSON } from "../Interfaces/ISAAInterface";

const _priorityDatas = (data: IAnnounceJSON[]): IAnnounceJSON[] => {
  let _priArray: IAnnounceJSON[] = [...data];

  for (let i: number = 0; _priArray.length > i; i++) {
    _priArray[i].Priority = (i + 1).toString();
  }

  return [..._priArray];
};

const _filCurrentData = (data: IAnnounceJSON[]): IAnnounceJSON[] => {
  let _showAnnounces: IAnnounceJSON[] = [];

  for (let i: number = 0; data.length > i; i++) {
    if (
      moment(new Date()).format("YYYYMMDD") >=
        moment(data[i].StartDate).format("YYYYMMDD") &&
      moment(new Date()).format("YYYYMMDD") <=
        moment(data[i].EndDate).format("YYYYMMDD") &&
      !data[i].IsDelete
    ) {
      _showAnnounces.push(data[i]);
    }
  }

  return [..._showAnnounces];
};

const _newAndEditAnnouncePrepare = (
  curData: IAnnounceJSON,
  curAnnounceData: IAnnounceJSON[],
  masterAnnounceData: IAnnounceJSON[],
  type: string
): IAnnounceJSON[] => {
  let _isMinNextAnnounce: boolean = false;
  let _isMaxNextAnnounce: boolean = false;
  let _isCurJSON: boolean = false;
  let _isData: boolean = true;
  let _curAnnounceArray: IAnnounceJSON[] = [...curAnnounceData];
  let _curRemAnnounceArray: IAnnounceJSON[] = [];
  let _curMasAnnounceArray: IAnnounceJSON[] = [...masterAnnounceData];
  let _arrMasAnnounce: IAnnounceJSON[] = [];

  if (
    moment(new Date()).format("YYYYMMDD") >=
      moment(curData.StartDate).format("YYYYMMDD") &&
    moment(new Date()).format("YYYYMMDD") <=
      moment(curData.EndDate).format("YYYYMMDD")
  ) {
    _isCurJSON = true;
  }

  _curRemAnnounceArray = _curMasAnnounceArray.filter(
    (obj1: IAnnounceJSON) =>
      !_curAnnounceArray.some((obj2: IAnnounceJSON) => obj1.ID === obj2.ID)
  );

  if (_isCurJSON) {
    if (_curAnnounceArray.length) {
      for (let i: number = 0; _curAnnounceArray.length > i; i++) {
        if (type === "new") {
          if (
            Number(_curAnnounceArray[i].Priority) === Number(curData.Priority)
          ) {
            _isData = false;
            _arrMasAnnounce.push({ ...curData });
            _arrMasAnnounce.push({ ..._curAnnounceArray[i] });
          } else {
            _arrMasAnnounce.push({ ..._curAnnounceArray[i] });
          }

          if (_isData && _curAnnounceArray.length === i + 1) {
            _arrMasAnnounce.push({ ...curData });
            _arrMasAnnounce.push(..._curRemAnnounceArray);
          }

          if (!_isData && _curAnnounceArray.length === i + 1) {
            _arrMasAnnounce.push(..._curRemAnnounceArray);
          }
        } else {
          if (
            Number(_curAnnounceArray[i].Priority) ===
              Number(curData.Priority) &&
            _curAnnounceArray[i].ID !== curData.ID
          ) {
            _isData = false;
            if (
              _curAnnounceArray.length <= Number(curData.Priority) &&
              _curAnnounceArray.length >= 2
            ) {
              _arrMasAnnounce.push({ ..._curAnnounceArray[i] });
              _arrMasAnnounce.push({ ...curData });
            } else {
              _arrMasAnnounce.push({ ...curData });
              _arrMasAnnounce.push({ ..._curAnnounceArray[i] });
            }
          } else if (_curAnnounceArray[i].ID !== curData.ID) {
            _arrMasAnnounce.push({ ..._curAnnounceArray[i] });
          }

          if (_isData && _curAnnounceArray.length === i + 1) {
            _arrMasAnnounce.push({ ...curData });
            _arrMasAnnounce.push(..._curRemAnnounceArray);
          }

          if (!_isData && _curAnnounceArray.length === i + 1) {
            _arrMasAnnounce.push(..._curRemAnnounceArray);
          }
        }
      }
    } else {
      _arrMasAnnounce.push({ ...curData });
    }
  } else {
    _arrMasAnnounce = _curAnnounceArray.filter(
      (val: IAnnounceJSON) => val.ID !== curData.ID
    );

    if (_curRemAnnounceArray.length) {
      if (Number(_curRemAnnounceArray[0].Priority) > Number(curData.Priority)) {
        _isMinNextAnnounce = true;
        _arrMasAnnounce.push({ ...curData });
        _arrMasAnnounce.push(..._curRemAnnounceArray);
      }
      if (
        Number(_curRemAnnounceArray[_curRemAnnounceArray.length - 1].Priority) <
        Number(curData.Priority)
      ) {
        _isMaxNextAnnounce = true;
        _arrMasAnnounce.push(..._curRemAnnounceArray);
        _arrMasAnnounce.push({ ...curData });
      }

      if (!_isMinNextAnnounce && !_isMaxNextAnnounce) {
        for (let i: number = 0; _curRemAnnounceArray.length > i; i++) {
          if (type === "new") {
            if (
              Number(_curRemAnnounceArray[i].Priority) ===
              Number(curData.Priority)
            ) {
              _isData = false;
              _arrMasAnnounce.push({ ...curData });
              _arrMasAnnounce.push({ ..._curRemAnnounceArray[i] });
            } else {
              _arrMasAnnounce.push({ ..._curRemAnnounceArray[i] });
            }

            if (_isData && _curRemAnnounceArray.length === i + 1) {
              _arrMasAnnounce.push({ ...curData });
            }
          } else {
            if (
              Number(_curRemAnnounceArray[i].Priority) ===
                Number(curData.Priority) &&
              _curRemAnnounceArray[i].ID !== curData.ID
            ) {
              _isData = false;
              _arrMasAnnounce.push({ ...curData });
              _arrMasAnnounce.push({ ..._curRemAnnounceArray[i] });
            } else if (_curRemAnnounceArray[i].ID !== curData.ID) {
              _arrMasAnnounce.push({ ..._curRemAnnounceArray[i] });
            }

            if (_isData && _curRemAnnounceArray.length === i + 1) {
              _arrMasAnnounce.push({ ...curData });
            }
          }
        }
      }
    } else {
      _arrMasAnnounce.push({ ...curData });
    }
  }

  return [..._arrMasAnnounce];
};

const _prepareArray = (
  masData: IAnnounceJSON[],
  data: IAnnounceJSON,
  type: string
): IAnnounceJSON[] => {
  let _curArray: IAnnounceJSON[] = [];
  let _isData: boolean = true;

  if (masData.length) {
    for (let i: number = 0; masData.length > i; i++) {
      if (type === "new") {
        if (Number(masData[i].Priority) === Number(data.Priority)) {
          _isData = false;
          if (masData.length <= Number(data.Priority) && masData.length >= 2) {
            _curArray.push({ ...masData[i] });
            _curArray.push({ ...data });
          } else {
            _curArray.push({ ...data });
            _curArray.push({ ...masData[i] });
          }
        } else {
          _curArray.push({ ...masData[i] });
        }

        if (_isData && masData.length === i + 1) {
          _curArray.push({ ...data });
        }
      } else {
        if (
          Number(masData[i].Priority) === Number(data.Priority) &&
          masData[i].ID !== data.ID
        ) {
          _isData = false;
          if (masData.length <= Number(data.Priority) && masData.length >= 2) {
            _curArray.push({ ...masData[i] });
            _curArray.push({ ...data });
          } else {
            _curArray.push({ ...data });
            _curArray.push({ ...masData[i] });
          }
        } else if (masData[i].ID !== data.ID) {
          _curArray.push({ ...masData[i] });
        }

        if (_isData && masData.length === i + 1) {
          _curArray.push({ ...data });
        }
      }
    }
  } else {
    _curArray.push({ ...data });
  }

  return [..._curArray];
};

const _sortingArray = (data: IAnnounceJSON[]): IAnnounceJSON[] => {
  let _sortedArray: IAnnounceJSON[] = [...data];

  _sortedArray.sort(
    (a: IAnnounceJSON, b: IAnnounceJSON) =>
      Number(a.Priority) - Number(b.Priority)
  );

  return [..._sortedArray];
};

const _filterReminderData = (
  masData: IAnnounceJSON[],
  data: IAnnounceJSON[],
  curData: IAnnounceJSON[],
  type: string
): IAnnounceJSON[] => {
  let _filData: IAnnounceJSON[] = [];
  let _filteredArray: IAnnounceJSON[] = [];
  let _filMasterArray: IAnnounceJSON[] = [];

  if (type === "delete") {
    debugger;
    _filteredArray = data.filter(
      (obj1: IAnnounceJSON) =>
        !curData.some((obj2: IAnnounceJSON) => obj1.ID === obj2.ID)
    );
    _filMasterArray = masData.filter(
      (obj1: IAnnounceJSON) =>
        !data.some((obj2: IAnnounceJSON) => obj1.ID === obj2.ID)
    );
  } else {
    _filteredArray = masData.filter(
      (obj1: IAnnounceJSON) =>
        !data.some((obj2: IAnnounceJSON) => obj1.ID === obj2.ID)
    );
  }

  _filData =
    type === "delete"
      ? [..._filteredArray, ..._filMasterArray]
      : [...data, ..._filteredArray];

  return [..._filData];
};

export default {
  _priorityDatas,
  _filCurrentData,
  _prepareArray,
  _sortingArray,
  _filterReminderData,
  _newAndEditAnnouncePrepare,
};
