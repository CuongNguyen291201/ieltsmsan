import { FC } from 'react';
import { AppProps } from 'next/app';
import "nprogress/nprogress.css";
import '../styles/_global.scss';
import { wrapper } from '../redux/store';
import dynamic from "next/dynamic";
import { SnackbarProvider } from "notistack";

const TopProgressBar = dynamic(() => import('../components/TopProgressBar'), { ssr: false });
const ToastBackgroundContainer = dynamic(() => import('../sub_modules/common/components/toast_container'));

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <TopProgressBar />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={5000}>
        <Component {...pageProps} />
      </SnackbarProvider>
      <ToastBackgroundContainer />
    </>
  )
}

export default wrapper.withRedux(App);