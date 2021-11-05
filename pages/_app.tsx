import { FC } from 'react';
import { AppProps } from 'next/app';
import "nprogress/nprogress.css";
import '../styles/_global.scss';
import { wrapper } from '../redux/store';
import ToastBackgroundContainer from '../sub_modules/common/components/toast_container';
import dynamic from "next/dynamic";

const TopProgressBar = dynamic(() => import('../components/TopProgressBar'), { ssr: false });

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <TopProgressBar />
      <Component {...pageProps} />
      <ToastBackgroundContainer />
    </>
  )
}

export default wrapper.withRedux(App);