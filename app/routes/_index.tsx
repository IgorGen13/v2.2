import type { MetaFunction } from '@remix-run/node';
import '../styles/constants.scss';
import { MainPage } from '../pages/MainPage';

export const meta: MetaFunction = () => {
	return [{ title: 'HLS' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
	return (
		<div>
			<MainPage
				cards={[
					{ src: '/video/hls/1.m3u8', thumbnail: '/video/1.jpg' },
					{ src: '/video/hls/2.m3u8', thumbnail: '/video/2.jpg' },
					{ src: '/video/hls/3.m3u8', thumbnail: '/video/3.jpg' },

				]}
			/>
		</div>
	);
}
