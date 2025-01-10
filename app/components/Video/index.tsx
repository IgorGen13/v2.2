import React, { useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useLatest } from '~/hooks/useLatest';
import { MuteButton } from './MuteButton';
import styles from './index.module.scss';
import classNames from 'classnames';

export const VideoJS = (props: any) => {
	const videoRef = React.useRef<any>(null);
	const playerRef = React.useRef<any>(null);
	const { url, active, next, onChangeMuted, muted } = props;

	const [showSpinner, setShowSpinner] = useState(false);

	console.log({ showSpinner });

	const latestProps = useLatest(props);

	const [paused, setPaused] = useState(true);

	useEffect(() => {
		if (playerRef.current) {
			videoRef.current.muted = muted;
			playerRef.current.setMute(muted);
		}
	}, [muted]);

	useEffect(() => {
		if (playerRef.current) {
			if (paused || !active) {
				playerRef.current.pause();
			} else {
				playerRef.current.play();
			}
		}
	}, [muted, paused, active]);

	useEffect(() => {
		if (active || next) {
			// Make sure Video.js player is only initialized once
			if (!playerRef.current) {
				const player = (playerRef.current = dashjs.MediaPlayer().create());

				player.on(dashjs.MediaPlayer.events.PLAYBACK_NOT_ALLOWED, function () {
					onChangeMuted(true);
					player.initialize(videoRef.current, url, active);
				});

				player.initialize(videoRef.current, url, active);
				videoRef.current.muted = muted;
				playerRef.current.setMute(muted);
			}
		}
	}, [videoRef, next, active]);

	// Dispose the Video.js player when the functional component unmounts
	React.useEffect(() => {
		const player = playerRef.current;

		return () => {
			if (player) {
				player.reset();
				playerRef.current = null;
			}
		};
	}, [playerRef]);

	useEffect(() => {
		if (playerRef.current) {
			if (active) {
				setPaused(false);
			} else {
				setPaused(true);
				if (!next) {
					setTimeout(() => {
						if (!latestProps.current.next && !latestProps.current.active) {
							playerRef.current?.reset();
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
