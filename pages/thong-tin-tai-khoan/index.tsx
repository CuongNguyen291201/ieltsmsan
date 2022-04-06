import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { GetServerSideProps } from 'next'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import { useAppDispatch, useAppSelector } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import { getWebMenuAction } from '../../redux/actions/menu.action'
import { wrapper } from '../../redux/store'
import WebInfo from '../../sub_modules/share/model/webInfo'
import WebSeo from '../../sub_modules/share/model/webSeo'
import WebSocial from '../../sub_modules/share/model/webSocial'
import { apiGetPageLayout } from '../../utils/apis/pageLayoutApi'
import './style.scss'
import UploadAvatar from './UploadAvatar'
import moment from 'moment'
import { withStyles } from '@mui/styles'
import { validatePhone } from '../../sub_modules/common/utils'
import { apiUpdateUserInfo } from '../../utils/apis/auth'
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';

const UserInfo = (props: {
    webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial
}) => {
    const { register, handleSubmit, reset } = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const currentUser = useAppSelector((state) => state.userReducer.currentUser);
    const dispatch = useAppDispatch();
    const [avatar, setAvatar] = useState("");
    const [gender, setGender] = useState(-1);
    const [birth, setBirth] = useState(0);

    const _TextField = withStyles({
        root: {
            background: "#f2f5fd",
            border: 0,
            borderRadius: "5px",
        }
    })(TextField);

    const onSubmit = (data: any) => {
        if (!validatePhone(data.phoneNumber)) {
            enqueueSnackbar("Số điện thoại không hợp lệ!!", { variant: "error" })
        } else {
            apiUpdateUserInfo({ ...data, avatar, gender, birth })
                .then((res) => {
                    dispatch(loginSuccessAction(res))
                    enqueueSnackbar("Cập nhật thông tin thành công!!", { variant: "success" })
                })
                .catch((err) => enqueueSnackbar("Lỗi, không cập nhật được thông tin!!", { variant: "error" }))
        }
        reset()
    }

    useAuth({ unAuthenticatedRedirect: "/" });
    return (
        <Layout useDefaultBackground {...props}>
            <div className="container" >
                <h2 style={{ textAlign: "center" }}>CẬP NHẬP THÔNG TIN TÀI KHOẢN</h2>
                <div className="update-info">
                    <form className="form-update-user-info" onSubmit={handleSubmit(onSubmit)}>
                        <UploadAvatar
                            onUploadFinished={(items) => setAvatar(items.url)}
                            onUploadSuccess={(file) => enqueueSnackbar(`Đã tải lên: ${file.name}`, { variant: "success" })}
                            onUploadError={(file) => enqueueSnackbar(`Tải lên thất bại: ${file.name}`, { variant: "error" })}
                        />
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Họ tên (*)</label>
                            </div>
                            <input required defaultValue={currentUser?.name} className="input-field" {...register("name")} placeholder="Nhập họ tên" />
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Ngày sinh (*)</label>
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={birth ? birth : moment().valueOf()}
                                    onChange={(newValue: any) => setBirth(moment(newValue).valueOf())}
                                    renderInput={(params) => <_TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Giới tính (*)</label>
                            </div>
                            <RadioGroup row defaultValue={currentUser?.gender} onChange={(e, value) => setGender(+value)}>
                                <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                                <FormControlLabel value={-1} control={<Radio />} label="Khác" />
                            </RadioGroup>
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Email (*)</label>
                            </div>
                            <input required type="email" className="input-field" value={currentUser?.email} {...register("email")} placeholder="Nhập email" readOnly />
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Số điện thoại (*)</label>
                            </div>
                            <input required className="input-field" defaultValue={currentUser?.phoneNumber} {...register("phoneNumber")} placeholder="Nhập số điện thoại" />
                        </div>
                        <button className="btn-submit" type="submit">Cập nhật</button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
    store.dispatch(getWebMenuAction(webMenuItems));
    return { props: { webInfo, webSocial } }
})

export default UserInfo