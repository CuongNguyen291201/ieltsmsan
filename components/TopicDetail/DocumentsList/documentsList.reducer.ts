import Axios from 'axios';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import Document from "../../../sub_modules/share/model/document";
// Action Types

enum ActionTypes {
  SET_OPEN_DOCUMENT_ITEMS,
  SET_PREVIEW_URL,
}

interface DocumentsListAction {
  type: ActionTypes;
  documentId?: string;
  documentOpen?: boolean;
  previewUrl?: string;
  documentTitle?: string;
}

// State

type DocumentsListState = {
  mapStateOpen: {
    [documentId: string]: boolean
  },
  previewUrl: string;
  documentTitle: string;
}

export const documentsListInitState: DocumentsListState = {
  mapStateOpen: {},
  previewUrl: '',
  documentTitle: ''
}

// Reducer

export const documentsListReducer = (state: DocumentsListState, action: DocumentsListAction): DocumentsListState => {
  switch (action.type) {
    case ActionTypes.SET_OPEN_DOCUMENT_ITEMS:
      return {
        ...state,
        mapStateOpen: {
          ...state.mapStateOpen,
          [action.documentId!]: !!action.documentOpen
        }
      }

    case ActionTypes.SET_PREVIEW_URL:
      return {
        ...state,
        previewUrl: action.previewUrl || '',
        documentTitle: action.documentTitle || ''
      }

    default:
      throw new Error("Unkown Action");
  }
}

// Action Creators

export const setOpenDocumentItems = (documentId: string, documentOpen: boolean): DocumentsListAction => ({
  type: ActionTypes.SET_OPEN_DOCUMENT_ITEMS, documentId, documentOpen
});

export const setPreviewUrl = (previewUrl: string, documentTitle?: string): DocumentsListAction => ({
  type: ActionTypes.SET_PREVIEW_URL, previewUrl, documentTitle
});

export const getFileMimeType = (url: string) => {
  const fileExtension = url.slice(url.lastIndexOf('.') + 1);
  switch (fileExtension) {
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pdf':
      return 'application/pdf';

    case 'png':
      return 'image/png';

    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';

    case 'xls':
      return 'application/vnd.ms-excel';

    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    default:
      return null;
  }
};

export const downloadSingleFile = (title: string, url: string) => {
  if (!url) return;
  const fullFileExtension = url.slice(url.lastIndexOf('.'));
  FileSaver.saveAs(url, `${title}${fullFileExtension}`);
}

export const downloadDocument = (document: Document) => {
  try {
    if (document.items.length > 1) {
      const zip = new JSZip();
      const folder = zip.folder(document.title);

      Promise
        .all((document.itemsDetail || []).map(async (item, i) => {
          const fullFileExtension = item.url.slice(item.url.lastIndexOf('.'));
          const fileName = `${document.title}_${i + 1}${fullFileExtension}`;
          const { data } = await Axios.get(item.url, { responseType: "blob" });
          folder.file(fileName, data, { binary: true });
        }))
        .then(() => {
          return zip.generateAsync({ type: "blob" })
        })
        .then((blob) => {
          FileSaver.saveAs(blob, `${document.title}.zip`);
          // return true;
        })
        .catch((error) => {
          console.error(error);
          // return false;
        });
    } else {
      const [url] = (document.itemsDetail || []).map((item) => item.url);
      if (!url) return;
      downloadSingleFile(document.title, url);
    }
  } catch (error) {
    console.error(error);
    // return false;
  }
}
