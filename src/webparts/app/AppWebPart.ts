import * as React from "react";
import * as ReactDom from "react-dom";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "AppWebPartStrings";
import App from "./components/App";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph/presets/all";
import { IAppProps } from "./components/IAppProps";
import { SPComponentLoader } from "@microsoft/sp-loader";

require("../../../node_modules/primereact/resources/primereact.min.css");
require("../../../node_modules/primeflex/primeflex.css");

export interface IAppWebPartProps {
  description: string;
}

export default class AppWebPart extends BaseClientSideWebPart<IAppWebPartProps> {
  public constructor() {
    super();
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    );
    SPComponentLoader.loadCss(
      "https://fonts.googleapis.com/css2?family=Lato&display=swap"
    );
    SPComponentLoader.loadCss("https://unpkg.com/primeicons/primeicons.css");
  }

  public async onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context as unknown as undefined,
    });

    graph.setup({
      spfxContext: this.context as unknown as undefined,
    });
    await super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IAppProps> = React.createElement(App, {
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
