import styles from './index.module.scss';
import { Link } from '@remix-run/react';
export default function IndexPage() {
	return (
		<div className={styles.root}>
			<Link to={'/hls'}>HLS </Link> / <Link to={'/dash'}> DASH</Link>
		</div>
	);
}
