import Head from 'next/head';
import React, { FC, useEffect, useMemo, useState } from 'react';
import SeoProps from "../../custom-types/SeoProps";
import { META_ROBOT_INDEX_FOLLOW, META_ROBOT_NO_INDEX_NO_FOLLOW } from "../../sub_modules/share/constraint";
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import Footer from '../Footer';
import MainMenu from '../MainMenu';
import './style.scss';

const Layout: FC<{
	addMathJax?: boolean;
	webInfo?: WebInfo;
	webSeo?: WebSeo;
	hideMenu?: boolean;
	hideFooter?: boolean;
	webSocial?: WebSocial;
	useDefaultBackground?: boolean;
} & SeoProps> = (props) => {
	const {
		addMathJax,
		children,
		webInfo,
		webSeo,
		hideMenu = false,
		hideFooter = false,
		webSocial,
		useDefaultBackground,
		title = '',
		description = '',
		robot = META_ROBOT_NO_INDEX_NO_FOLLOW,
		keyword = '',
		canonicalSlug,
	} = props;
	const [isVisible, setVisible] = useState(false);
	const siteName = useMemo(() => webInfo?.name || process.env.NEXT_PUBLIC_SITENAME || 'Template', [webInfo]);
	const metaRobot = useMemo(() => typeof robot === "number"
		? (robot === META_ROBOT_INDEX_FOLLOW ? "index, follow" : "noindex, nofollow")
		: robot, [robot]);
	const canonical = useMemo(() => {
		if (!(canonicalSlug || webSeo?.slug)) return '';
		if (canonicalSlug.startsWith("http")) return canonicalSlug;
		return `${process.env.NEXT_PUBLIC_DOMAIN}${canonicalSlug.startsWith('/') ? canonicalSlug : `/${canonicalSlug}`}`
	}, [canonicalSlug, webSeo]);
	useEffect(() => {
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



	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<title>{title ? `${title} - ${siteName}` : siteName}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="keywords" content={keyword || webSeo?.keyword || ''} />
				<meta name="description" content={description || webSeo?.descriptionSeo || ''} />
				<meta name="robots" content={metaRobot} />
				<meta name="title" content={title || webSeo?.seoTitle || ''} />
				<link rel="shortcut icon" href={webInfo?.favicon || "/favicon.ico"} />
				{!!canonical && <link rel="canonical" href={canonical} />}
				{addMathJax && (<script type="text/javascript" async
					src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
				</script>)}
			</Head>

			<div id="main-page-wrapper" {...{ className: useDefaultBackground ? '-default-background' : undefined }}>
				{!hideMenu && <MainMenu hotLine={webInfo?.hotLine} webLogo={webInfo?.webLogo} />}
				{children}
				{!hideFooter && <Footer webInfo={webInfo} webSocial={webSocial} />}
				{isVisible && (
					<div id="scroll-top-button" onClick={scrollToTop}>
						<div className="scrollTop">
							<i className="fas fa-arrow-up" />
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Layout;