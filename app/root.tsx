import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { useEffect } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {

	useEffect(() => {
		console.log('Hydration complete');
	  }, []);


	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script src="https://cdn.dashjs.org/v3.1.0/dash.all.min.js" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
