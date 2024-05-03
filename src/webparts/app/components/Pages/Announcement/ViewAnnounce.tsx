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
      <div>
        <div className="viewLable">Description</div>
        <div>{curAnnounceData.Description}</div>
      </div>
      <div>
        <div>
          <div className="viewLable">Priority</div>
          <div>{curAnnounceData.Priority}</div>
        </div>
        <div>
          <div className="viewLable">Start Date</div>
          <div>{moment(curAnnounceData.StartDate).format("MM/DD/YYYY")}</div>
        </div>
        <div>
          <div className="viewLable">End Date</div>
          <div>{moment(curAnnounceData.EndDate).format("MM/DD/YYYY")}</div>
        </div>
      </div>
      <div>
        <Button
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
