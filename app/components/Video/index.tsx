import React, { useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useLatest } from '~/hooks/useLatest';
import { MuteButton } from './MuteButton';
import styles from './index.module.scss';
import classNames from 'classnames';
import Hls from 'hls.js';

export const VideoJS = (props: any) => {
	const videoRef = React.useRef<any>(null);
	const playerRef = React.useRef<any>(null);
	const { url, active, next, onChangeMuted, muted } = props;

	const [showSpinner, setShowSpinner] = useState(false);

	console.log({ showSpinner });

	const latestProps = useLatest(props);

	const [paused, setPaused] = useState(true);

	useEffect(() => {
		if (playerRef.current && videoRef.current) {
			console.log('Muted state applied:', muted);
			videoRef.current.muted = muted;
		}
	}, [muted]);

	useEffect(() => {
		if (playerRef.current && videoRef.current) {
			console.log('Playback state:', paused, active);
			if (paused || !active) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
		}
	}, [paused, active]);

	useEffect(() => {
		if (active || next) {
			if (!playerRef.current && videoRef.current) {
				console.log('HLS is supported. Initializing Hls.js.');
				const hls = new Hls();
				playerRef.current = hls;
				hls.loadSource(url);
				console.log('HLS loadSource called with URL:', url);
				hls.attachMedia(videoRef.current);
				console.log('HLS attachMedia called with video element:', videoRef.current);
				videoRef.current.load();
				console.log('videoRef load called.');
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					console.log('Manifest parsed. Playing video.');
					if (active) {
						videoRef.current.play();
					}
				});
				hls.on(Hls.Events.ERROR, function(event, data) {
					if (data.fatal) {
						switch (data.type) {
							case Hls.ErrorTypes.NETWORK_ERROR:
								console.error('Network error encountered:', data);
								break;
							case Hls.ErrorTypes.MEDIA_ERROR:
								console.error('Media error encountered:', data);
								break;
							default:
								console.error('General error encountered:', data);
								break;
						}
					} else {
						console.warn('Non-fatal error encountered:', data);
					}
				});
				videoRef.current.muted = muted;
			} else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
				console.log('Native HLS support detected.');
				videoRef.current.src = url;
				videoRef.current.load();
				videoRef.current.muted = muted;
				videoRef.current.addEventListener('loadedmetadata', () => {
					console.log('Metadata loaded. Playing video.');
					if (active) {
						videoRef.current.play();
					}
				});
				videoRef.current.addEventListener('error', (event: any) => {
					console.error('Video element error:', event);
				});
			}
		}
	}, [videoRef, next, active, url, muted]);
	

	// Очистка плеера при размонтировании компонента
	useEffect(() => {
		return () => {
			if (playerRef.current) {
				if (playerRef.current instanceof Hls) {
					playerRef.current.destroy();
				}
				playerRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (playerRef.current) {
			if (active) {
				setPaused(false);
			} else {
				setPaused(true);
				if (!next) {
					setTimeout(() => {
						if (!latestProps.current.next && !latestProps.current.active) {
							if (playerRef.current instanceof Hls) {
								playerRef.current.destroy();
							}
							playerRef.current = null;
						}
					}, 500);
				}
			}
		}
	}, [active, next]);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.load(); // Перезагрузка видео при смене URL
		}
	}, [url]);

	return (
		<div className={props.className}>
			<video
				className={styles.card}
				preload="auto"
				crossOrigin="anonymous"
				loop
				onLoadStart={() => {
					setShowSpinner(true);
				}}
				onWaiting={() => {
					setShowSpinner(true);
				}}
				onCanPlay={() => {
					setShowSpinner(false);
				}}
				onPlaying={() => {
					setShowSpinner(false);
				}}
				onClick={() => {
					setPaused((pause) => !pause);
				}}
				style={{
					backgroundImage: `url(${props.background})`,
					backgroundSize: 'cover',
				}}
				ref={videoRef}
			/>
			<div className={styles.spinnerWrapper}>
				<div className={classNames(styles.spinner, showSpinner && styles.spinnerVisible)}>
					<div className={styles.doubleBounce1} />
					<div className={styles.doubleBounce2} />
				</div>
			</div>
			<MuteButton
				className={styles.muteButton}
				muted={muted}
				onClick={() => {
					onChangeMuted(!muted);
				}}
			/>
		</div>
	);
};

export default VideoJS;
