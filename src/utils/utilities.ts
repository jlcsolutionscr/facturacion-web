import CryptoJS from "crypto-js";
import { parse } from "date-fns";
import { XMLParser } from "fast-xml-parser";
import { saveAs } from "file-saver";
import { IdDescriptionValueType } from "types/domain";
import * as XLSX from "xlsx";

type HeaderType = {
  Accept: string;
  "Content-Type": string;
  Authorization?: string;
};

type NodeType = {
  name: string;
  value: string;
  children: NodeType[];
};

export function encryptString(plainText: string) {
  const phrase = "Po78]Rba[%J=[14[*";
  const data = CryptoJS.enc.Utf8.parse(plainText);
  const passHash = CryptoJS.enc.Utf8.parse(phrase);
  const iv = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
  const saltKey = CryptoJS.enc.Utf8.parse("S@LT&KEY");
  const key128Bits1000Iterations = CryptoJS.PBKDF2(passHash, saltKey, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  const encrypted = CryptoJS.AES.encrypt(data, key128Bits1000Iterations, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  });
  const encryptedText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  return encryptedText;
}

export function formatCurrency(number: number, decPlaces = 2, decSep = ".", thouSep = ",") {
  const decIndex = number.toString().indexOf(decSep);
  let decValue = decIndex > 0 ? number.toString().substring(1 + decIndex, 1 + decIndex + decPlaces) : "";
  if (decValue.length < decPlaces) decValue += "0".repeat(decPlaces - decValue.length);
  const integerValue = decIndex > 0 ? number.toString().substring(0, decIndex) : number.toString();
  return integerValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thouSep}`) + decSep + decValue;
}

export function roundNumber(number: number, places: number) {
  return +(Math.round(parseFloat(number + `e+${places}`)) + `e-${places}`);
}

export function convertToDateString(date: Date | string) {
  if (date === "" || date === null) return "";
  if (typeof date === "string") date = parse(date.substring(0, 10), "yyyy-MM-dd", new Date());
  const dayFormatted = (date.getDate() < 10 ? "0" : "") + date.getDate();
  const monthFormatted = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
  return `${dayFormatted}/${monthFormatted}/${date.getFullYear()}`;
}

export function convertToDateTimeString(date: Date | string) {
  if (typeof date === "string") date = new Date(date);
  const dayFormatted = (date.getDate() < 10 ? "0" : "") + date.getDate();
  const monthFormatted = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
  return `${date.getFullYear()}-${monthFormatted}-${dayFormatted}T23:59:59`;
}

export function getTaxeRateFromId(taxTypeList: IdDescriptionValueType[], id: number) {
  return taxTypeList.find(x => x.Id === id)?.Valor ?? 13;
}

export function getIdFromRateValue(taxTypeList: IdDescriptionValueType[], value: number) {
  return taxTypeList.find(elm => elm.Valor === value)?.Id ?? 8;
}

export function getDescriptionFromRateId(taxTypeList: IdDescriptionValueType[], id: number) {
  return taxTypeList.find(elm => elm.Id === id)?.Descripcion ?? "";
}

export function xmlToObject(value: string) {
  const decodedString = atob(value);
  const parser = new XMLParser();
  const xml = parser.parse(decodedString);
  const result: { [key: string]: string | object } = {};
  for (const node of xml.children) {
    parseNode(node, result);
  }
  return result;
}

function parseNode(xmlNode: NodeType, result: { [key: string]: string | object }) {
  if (xmlNode.name === "#text") {
    const v = xmlNode.value;
    if (v.trim()) result["#text"] = v;
    return;
  }
  const newResult = {};
  for (const node of xmlNode.children) {
    parseNode(node, newResult);
  }
  if (xmlNode.value !== "") {
    result[xmlNode.name] = xmlNode.value;
  } else {
    result[xmlNode.name] = newResult;
  }
}

export function ExportDataToXls(filename: string, title: string, data: { [key: string]: string | number | boolean }[]) {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: title,
    Subject: title,
    Author: "JLC Solutions CR",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push("Datos");
  const ws_data = [];
  const columns = Object.entries(data[0]).map(key => key[0]);
  ws_data.push(columns.map(key => key));
  data.forEach(row => {
    ws_data.push(columns.map(key => row[key]));
  });
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Datos"] = ws;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename + ".xlsx");
}

export async function getWithResponse(endpointURL: string, token: string) {
  const headers: HeaderType = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token !== null) {
    headers.Authorization = "bearer " + token;
  }
  const response = await fetch(endpointURL, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    let error = "";
    try {
      error = await response.json();
    } catch {
      error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.";
    }
    throw new Error(error);
  } else {
    const data = await response.json();
    if (data !== "") {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
}

export async function post(endpointURL: string, token: string, data: string) {
  const headers: HeaderType = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token !== "") {
    headers.Authorization = "bearer " + token;
  }
  const response = await fetch(endpointURL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let error = "";
    try {
      error = await response.json();
    } catch {
      error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.";
    }
    throw new Error(error);
  }
}

export async function postWithResponse(endpointURL: string, token: string, data: string) {
  const headers: HeaderType = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token !== "") {
    headers.Authorization = "bearer " + token;
  }
  const response = await fetch(endpointURL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let error = "";
    try {
      error = await response.json();
    } catch {
      error = "Error al comunicarse con el servicio de factura electrónica. Por favor verifique su conexión de datos.";
    }
    throw new Error(error);
  } else {
    const data = await response.json();
    if (data !== "") {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
}

export function writeToLocalStorage(user: string, data: object) {
  const dateTime = Date.now();
  window.sessionStorage.setItem("session", JSON.stringify({ userName: user, dateTime, company: data }));
}

export function readFromLocalStorage() {
  const data = window.sessionStorage.getItem("session") || "{}";
  return JSON.parse(data);
}

export async function cleanLocalStorage() {
  window.sessionStorage.removeItem("session");
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function parseStringToNumber(value: string) {
  return value !== "" ? parseFloat(value) : "";
}
