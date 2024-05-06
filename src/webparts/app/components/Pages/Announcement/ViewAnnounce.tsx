import * as React from "react";
import { IAnnounceJSON } from "../../Interfaces/ISAAInterface";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../PrimeReactComponent/primereactComponents";
import {
  isViewDialogFun,
  selAnnounce,
} from "../../Redux/Reducer/AnnouncementReducer";
import * as moment from "moment";
import { AppConfig } from "../../Config/AppConfig";

const ViewAnnounce = (): JSX.Element => {
  // useDispatch creation
  const dispatch = useDispatch();

  // useSelector creation
  const curAnnounceData: IAnnounceJSON = useSelector(
    (state: any) => state.AnnounceDatas.curAnnounce
  );

  return (
    <div className="announceViewContainer">
      <img
        src={
          curAnnounceData.Attachments.length
            ? curAnnounceData.Attachments[0].ServerRelativeUrl
            : ""
        }
      />
      <div className="wrapper">
        <div className="viewLable">Description</div>
        <div className="textContent">{curAnnounceData.Description}</div>
      </div>
      <div>
        <div className="wrapper">
          <div className="viewLable">Priority</div>
          <div className="textContent">{curAnnounceData.Priority}</div>
        </div>
        <div className="wrapper">
          <div className="viewLable">Start Date</div>
          <div className="textContent">
            {moment(curAnnounceData.StartDate).format("MM/DD/YYYY")}
          </div>
        </div>
        <div className="wrapper">
          <div className="viewLable">End Date</div>
          <div className="textContent">
            {moment(curAnnounceData.EndDate).format("MM/DD/YYYY")}
          </div>
        </div>
      </div>
      <div>
        <Button
          className="secondaryBtn"
          label="Close"
          onClick={() => {
            dispatch(selAnnounce({ ...AppConfig.AnnounceJSON }));
            dispatch(isViewDialogFun(false));
          }}
        />
      </div>
    </div>
  );
};

export default ViewAnnounce;
