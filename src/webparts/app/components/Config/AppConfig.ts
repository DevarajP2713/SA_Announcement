import {
  IAnnounceJSON,
  IAnnounceListColumns,
  IAttachments,
  IListName,
} from "../Interfaces/ISAAInterface";

export namespace AppConfig {
  export const ListNames: IListName = {
    Announcement: "Announcement",
  };

  export const AnnounceListColumns: IAnnounceListColumns = {
    ID: "ID",
    Attachments: "Attachments",
    Description: "Description",
    EndDate: "EndDate",
    IsArchive: "IsArchive",
    IsDelete: "IsDelete",
    Priority: "Priority",
    StartDate: "StartDate",
  };

  export const AnnounceJSON: IAnnounceJSON = {
    ID: null,
    Attachments: [],
    Description: "",
    EndDate: null,
    StartDate: new Date(),
    Priority: "",
    IsArchive: false,
    IsDelete: false,
  };

  export const LibraryData: IAttachments = {
    content: [],
  };
}
