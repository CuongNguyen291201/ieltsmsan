import { FC } from 'react';
import { AppProps } from 'next/app';

import '../styles/_global.scss';
import { wrapper } from '../redux/store';
import ToastBackgroundContainer from '../sub_modules/common/components/toast_container';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <ToastBackgroundContainer />
    </>
  )
}

export default wrapper.withRedux(App);