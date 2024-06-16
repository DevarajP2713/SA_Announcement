interface IListName {
  Announcement: string;
  Announcements: string;
}

interface ISitePath {
  sitePath: string;
}

interface IAnnounceListColumns {
  ID: string;
  Attachments: string;
  Priority: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  IsArchive: string;
  IsDelete: string;
}

interface IAnnounceJSON {
  ID: number | null;
  Attachments: any;
  Priority: string | number;
  Description: string;
  StartDate: Date | any;
  EndDate: Date | any;
  IsArchive: boolean;
  IsDelete: boolean;
}

interface IAttachObj {
  name: string;
  content: any;
  ServerRelativeUrl: string;
}

interface IAttachments {
  content: IAttachObj[];
}

export {
  IListName,
  IAnnounceListColumns,
  IAnnounceJSON,
  IAttachObj,
  IAttachments,
  ISitePath,
};
