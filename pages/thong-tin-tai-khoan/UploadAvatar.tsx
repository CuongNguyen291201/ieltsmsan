import { makeStyles } from "@mui/styles";
import { ChangeEvent, useState } from "react";
import axios from 'axios';
import DocumentItem from "../../sub_modules/share/model/documentItem";
import { ENDPOINT_LOCAL } from "../../sub_modules/common/api";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";


const useStyles = makeStyles((_) => ({
  uploadInput: {
    display: "none"
  },
  buttonUpload: {
    textTransform: "none"
  }
}));

const UploadButton = (props: {
  id?: string;
  onUploadFinished?: (args: DocumentItem) => void;
  onUploadSuccess?: (args: File) => void;
  onUploadError?: (args: File) => void;
}) => {
  const classes = useStyles();
  const id = `sm-document-upload-button${props.id || ''}`;
  const { onUploadFinished, onUploadError, onUploadSuccess } = props;
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useAppDispatch();

  const handleChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files[0];
    if (fileList) {
      const file = fileList;
      const item = new DocumentItem({
        type: file.type ?? 'unknown',
        size: file.size ?? 0,
        createDate: file.lastModified ?? 0,
        name: file.name ?? 'untitled',
        url: ''
      });
      if (file.size > 33554432) {
        if (typeof onUploadError !== 'undefined') {
          onUploadError(file);
        }
      }
      const formData = new FormData();
      formData.append('file', file, file.name);
      try {
        const { status, data: url } = await axios.post(`${ENDPOINT_LOCAL}/api/upload-file`, formData);
        if (status === 200) {
          item.url = url;
          if (typeof onUploadSuccess !== 'undefined') {
            onUploadSuccess(file);
          }
          if (typeof onUploadFinished !== 'undefined') {
            onUploadFinished(item);
          }
          dispatch(loginSuccessAction({ ...currentUser, avatar: item.url }))
        }
      } catch (error) {
        if (typeof onUploadError !== 'undefined') {
          onUploadError(file);
        }
      }
    }
  }

  return (<div>
    <input
      className={classes.uploadInput}
      id={id}
      multiple
      type="file"
      onChange={handleChangeFiles}
    />
    <label htmlFor={id}>
      <img src={currentUser?.avatar ? currentUser?.avatar : "/images/icons/change-avatar.png"} style={{ cursor: "pointer" }} />
    </label>
    <p>Thay đổi ảnh đại diện</p>
  </div>)
}

export default UploadButton;