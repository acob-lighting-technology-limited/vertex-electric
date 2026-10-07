import type { StructureResolver } from "sanity/structure";
import { AVAILABILITY } from "./schemaTypes/vehicle";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Vertex")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Inventory")
        .child(
          S.list()
            .title("Inventory")
            .items([
              S.listItem().title("All stock").child(S.documentTypeList("vehicle").title("All stock")),
              ...AVAILABILITY.map((a) =>
                S.listItem()
                  .title(a.title)
                  .child(
                    S.documentTypeList("vehicle")
                      .title(a.title)
                      .filter("_type == 'vehicle' && availability == $a")
                      .params({ a: a.value }),
                  ),
              ),
            ]),
        ),
      S.documentTypeListItem("carModel").title("Car models"),
    ]);
