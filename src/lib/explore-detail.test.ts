import { describe, expect, it } from "vitest";
import { cleanCmsHtml, parseExpectItems, parseHighlights, parseTips } from "./explore-detail";

describe("parseHighlights", () => {
  it("reads an array, as the admin sends it", () => {
    expect(parseHighlights(["Charter and Tours", " Boat Rentals ", ""])).toEqual(["Charter and Tours", "Boat Rentals"]);
  });

  it("reads a JSON-encoded array, as older rows hold it", () => {
    expect(parseHighlights('["Charter and Tours","Boat Rentals"]')).toEqual(["Charter and Tours", "Boat Rentals"]);
  });

  it("splits plain text on new lines and commas", () => {
    expect(parseHighlights("Shelling, Sunsets\nKayaking")).toEqual(["Shelling", "Sunsets", "Kayaking"]);
  });

  it("returns nothing when the field is empty", () => {
    expect(parseHighlights(null)).toEqual([]);
    expect(parseHighlights(undefined)).toEqual([]);
    expect(parseHighlights("")).toEqual([]);
    expect(parseHighlights([])).toEqual([]);
  });
});

describe("parseTips", () => {
  it("reads an array or a JSON-encoded one", () => {
    expect(parseTips(["Arrive early", "Bring water"])).toEqual(["Arrive early", "Bring water"]);
    expect(parseTips('["Arrive early"]')).toEqual(["Arrive early"]);
  });

  it("keeps commas inside a tip, splitting plain text on new lines only", () => {
    expect(parseTips("Arrive early, before 9\nBring water")).toEqual(["Arrive early, before 9", "Bring water"]);
  });
});

describe("parseExpectItems", () => {
  it("reads { title, description } items from an array or a JSON-encoded one", () => {
    const items = [{ title: "Calm water", description: "Good for kids" }, { title: "Shade" }];
    const expected = [
      { title: "Calm water", description: "Good for kids" },
      { title: "Shade", description: "" },
    ];
    expect(parseExpectItems(items)).toEqual(expected);
    expect(parseExpectItems(JSON.stringify(items))).toEqual(expected);
  });

  it("drops items without a title and ignores plain text", () => {
    expect(parseExpectItems([{ description: "No title" }, "Calm water", null])).toEqual([]);
    expect(parseExpectItems("Calm water")).toEqual([]);
  });
});

describe("cleanCmsHtml", () => {
  it("drops pasted inline styles and <font> tags but keeps the text and classes", () => {
    const pasted =
      '<p style="font-family: Google Sans; font-size: 16px"><span style=\'color:#333\'>Boat <b>tours</b></span></p>' +
      '<figure class="image image-style-side"><img src="a.jpg" style=width:50%></figure><font face="Arial">Daily</font>';
    expect(cleanCmsHtml(pasted)).toBe(
      '<p><span>Boat <b>tours</b></span></p><figure class="image image-style-side"><img src="a.jpg"></figure>Daily',
    );
  });

  it("leaves text that merely mentions style= alone", () => {
    expect(cleanCmsHtml("<p>Dress style=casual</p>")).toBe("<p>Dress style=casual</p>");
  });
});
