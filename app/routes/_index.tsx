import type { MetaFunction } from '@remix-run/node';
import '../styles/constants.scss';
import { MainPage } from '../pages/MainPage';

export const meta: MetaFunction = () => {
	return [{ title: 'MPD' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
	return (
		<div>
			<MainPage
				cards={[
					{ src: '/video/dash/1.mpd', thumbnail: '/video/1.jpg' },
					{ src: '/video/dash/2.mpd', thumbnail: '/video/2.jpg' },
					{ src: '/video/dash/3.mpd', thumbnail: '/video/3.jpg' },
				]}
			/>
		</div>
	);
}
