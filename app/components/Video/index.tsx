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
			videoRef.current.muted = muted;
		}
	}, [muted]);
	
	useEffect(() => {
		if (playerRef.current && videoRef.current) {
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
				// Проверка поддержки HLS
				if (Hls.isSupported()) {
					const hls = new Hls();
					playerRef.current = hls;
	
					hls.loadSource(url);
					hls.attachMedia(videoRef.current);
	
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						if (active) {
							videoRef.current.play();
						}
					});
	
					videoRef.current.muted = muted;
				} else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
					// Нативная поддержка HLS на iOS
					videoRef.current.src = url;
					videoRef.current.muted = muted;
	
					videoRef.current.addEventListener('loadedmetadata', () => {
						if (active) {
							videoRef.current.play();
						}
					});
				}
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
	

	return (
		<div className={props.className}>
			<video
				className={styles.card}
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
