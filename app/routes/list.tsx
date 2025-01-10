import type { MetaFunction } from '@remix-run/node';
import '../styles/constants.scss';
import IndexPage from '~/pages/IndexPage';
export const meta: MetaFunction = () => {
	return [{ title: 'Main Page' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
	return <IndexPage />;
}

export function getStaticPaths() {
	return ['/', '/hls', '/dash'];
}
