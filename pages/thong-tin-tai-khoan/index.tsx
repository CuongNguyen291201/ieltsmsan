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
import { apiUpdateUserInfo } from '../../utils/apis/auth'
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { validatePhone } from '../../utils';
import Breadcrumb from '../../components/Breadcrumb';
import { ROUTER_USER_INFO } from '../../utils/router';

const UserInfo = (props: {
    webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial
}) => {
    const { register, handleSubmit, reset } = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const currentUser = useAppSelector((state) => state.userReducer.currentUser);
    const dispatch = useAppDispatch();
    const [avatar, setAvatar] = useState(currentUser?.avatar);
    const [gender, setGender] = useState(currentUser?.gender);
    const [birth, setBirth] = useState<number>();

    const _TextField = withStyles({
        root: {
            background: "#f2f5fd",
            border: 0,
            borderRadius: "5px",
        }
    })(TextField);

    const onSubmit = (data: any) => {
        if (!validatePhone(data.phoneNumber)) {
            enqueueSnackbar("S??? ??i???n tho???i kh??ng h???p l???!!", { variant: "error" })
        } else {
            apiUpdateUserInfo({ ...data, avatar, gender, birth })
                .then((res) => {
                    dispatch(loginSuccessAction(res))
                    enqueueSnackbar("C???p nh???t th??ng tin th??nh c??ng!!", { variant: "success" })
                })
                .catch((err) => enqueueSnackbar("L???i, kh??ng c???p nh???t ???????c th??ng tin!!", { variant: "error" }))
        }
        reset()
    }

    useAuth({ unAuthenticatedRedirect: "/" });
    return (
        <Layout useDefaultBackground {...props}>
            <div style={{ background: "#EBF0FC" }}>
                <div className="container">
                    <Breadcrumb items={[{ name: 'Th??ng tin t??i kho???n', slug: ROUTER_USER_INFO }]} />
                </div>
            </div>
            <div className="container" >
                <h2 style={{ textAlign: "center" }}>C???P NH???P TH??NG TIN T??I KHO???N</h2>
                <div className="update-info">
                    <form className="form-update-user-info" onSubmit={handleSubmit(onSubmit)}>
                        <UploadAvatar
                            onUploadFinished={(items) => setAvatar(items.url)}
                            onUploadSuccess={(file) => enqueueSnackbar(`???? t???i l??n: ${file.name}`, { variant: "success" })}
                            onUploadError={(file) => enqueueSnackbar(`T???i l??n th???t b???i: ${file.name}`, { variant: "error" })}
                        />
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">H??? t??n (*)</label>
                            </div>
                            <input required className="input-field" {...register("name")} placeholder="Nh???p h??? t??n" />
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Ng??y sinh (*)</label>
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={birth ? birth : currentUser?.birth}
                                    onChange={(newValue: any) => setBirth(moment(newValue).valueOf())}
                                    renderInput={(params) => <_TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Gi???i t??nh (*)</label>
                            </div>
                            <RadioGroup row defaultValue={-1} onChange={(e, value) => setGender(+value)}>
                                <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                <FormControlLabel value={0} control={<Radio />} label="N???" />
                                <FormControlLabel value={-1} control={<Radio />} label="Kh??c" />
                            </RadioGroup>
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">Email (*)</label>
                            </div>
                            <input required type="email" className="input-field" defaultValue={currentUser?.email} {...register("email")} placeholder="Nh???p email" readOnly />
                        </div>
                        <div className="input-cpt">
                            <div className="label-wrapper">
                                <label className="label">S??? ??i???n tho???i (*)</label>
                            </div>
                            <input required className="input-field" {...register("phoneNumber")} placeholder="Nh???p s??? ??i???n tho???i" />
                        </div>
                        <button className="btn-submit" type="submit">C???p nh???t</button>
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