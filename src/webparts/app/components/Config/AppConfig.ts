import {
  IAnnounceJSON,
  IAnnounceListColumns,
  IAttachments,
  IListName,
  ISitePath,
} from "../Interfaces/ISAAInterface";

export namespace AppConfig {
  export const ListNames: IListName = {
    Announcement: "Announcement",
    Announcements: "Announcements",
  };

  export const SitePath: ISitePath = {
    sitePath: "/sites/CRMDev/",
  };

  export const AnnounceListColumns: IAnnounceListColumns = {
    ID: "ID",
    Attachments: "Attachments",
    Description: "Content",
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
