import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import dynamic from "next/dynamic";
import { SnackbarProvider } from "notistack";
import "nprogress/nprogress.css";
import { FC } from 'react';
import theme from "../components/theme";
import { wrapper } from '../redux/store';
import '../styles/_global.scss';

const TopProgressBar = dynamic(() => import('../components/TopProgressBar'), { ssr: false });
const ToastBackgroundContainer = dynamic(() => import('../sub_modules/common/components/toast_container'));

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <TopProgressBar />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={5000}>
        <Component {...pageProps} />
      </SnackbarProvider>
      <ToastBackgroundContainer />
    </ThemeProvider>
  )
}

export default wrapper.withRedux(App);