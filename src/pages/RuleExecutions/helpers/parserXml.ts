import { XMLParser } from "fast-xml-parser";

export const parseXML = async (file: File): Promise<Record<string, any>[]> => {
  const text = await file.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(text);
  const rootKey = Object.keys(json)[0];
  return Array.isArray(json[rootKey].item)
    ? json[rootKey].item
    : [json[rootKey].item];
};
