import 'antd/dist/antd.css';
import Head from 'next/head';
import React, { FC, useEffect, useState } from 'react';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { ROUTER_GAME } from '../../utils/router';
import Footer from '../Footer';
import MainHeader from '../MainHeader';
import MainMenu from '../MainMenu';
import './style.scss';

const Layout: FC<{
	addMathJax?: boolean;
	webInfo?: WebInfo;
	webSeo?: WebSeo;
	hideHeader?: boolean;
	hideMenu?: boolean;
	hideFooter?: boolean;
	webSocial?: WebSocial;
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
	const [isVisible, setVisible] = useState(false);
	useEffect(() => {
		window.onscroll = () => fixedTop();
		const toggleVisibility = () => {
			if (window.pageYOffset > 1000) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		}
	}, []);

	const fixedTop = () => {
		const headerPage = document.getElementById("header");
		const offsetHeightPage = 112;
		if (!hideHeader && !hideMenu) {
			if (window.pageYOffset > offsetHeightPage) {
				headerPage.classList.add('fixed-menu-top');
			} else {
				headerPage.classList.remove('fixed-menu-top')
			}
		}
	}

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

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
			<div id="header">
				{!hideHeader && <MainHeader webInfo={webInfo} />}
				{!hideMenu && <MainMenu hotLine={webInfo?.hotLine} />}
			</div>
			{children}
			{!hideFooter && <Footer webInfo={webInfo} webSocial={webSocial} />}
			{isVisible && (
				<div id="scroll-top-button" onClick={scrollToTop}>
					<div className="scrollTop">
						<i className="fas fa-arrow-up" />
					</div>
				</div>
			)}
		</>
	)
}

export default Layout;