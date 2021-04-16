import Head from 'next/head';
import React, { FC } from 'react';

const Layout: FC<{ addMathJax?: boolean }> = (props) => {
	const { addMathJax, children } = props
	return (
		<>
			<Head>
				<title>Template</title>
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
				<meta charSet="utf-8" />
				<meta name="keywords" content="" />
				<meta name="description" content="" />
				<meta name="title" content="" />
				<link rel="icon" href="" />
				<link rel="shortcut icon" href="/favicon.ico" />
				{addMathJax && (<script type="text/javascript" async
					src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
				</script>)}
			</Head>
			{children}
		</>
	)
}

export default Layout;