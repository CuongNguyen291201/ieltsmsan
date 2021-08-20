import 'antd/dist/antd.css';
import Head from 'next/head';
import React, { FC } from 'react';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import Footer from '../Footer';
import MainHeader from '../MainHeader';
import MainMenu from '../MainMenu';

const Layout: FC<{
	addMathJax?: boolean;
	webInfo?: WebInfo;
	webSeo?: WebSeo;
	hideHeader?: boolean;
	hideMenu?: boolean;
	hideFooter?: boolean;
	webSocial : WebSocial;
}> = (props) => {
	const {
		addMathJax,
		children,
		webInfo,
		webSeo,
		hideHeader = false,
		hideMenu = false,
		hideFooter = false,
		webSocial,
	} = props;
	return (
		
		
		<>
			<Head>
				<meta charSet="utf-8" />
				<title>{webInfo?.name || 'Ôn thi sinh viên'}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="keywords" content={webSeo?.keyword} />
				<meta name="description" content={webSeo?.descriptionSeo} />
				<meta name="title" content={webSeo?.seoTitle} />
				<link rel="shortcut icon" href={webInfo?.favicon || "/favicon.ico"} />
				{addMathJax && (<script type="text/javascript" async
					src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
				</script>)}
			</Head>
			{!hideHeader && <MainHeader webInfo={webInfo} />}
			{!hideMenu && <MainMenu />}
			{children}
			{!hideFooter && <Footer webInfo={webInfo} webSocial={webSocial} />}
		</>
	)
}

export default Layout;