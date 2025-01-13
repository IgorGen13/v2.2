import glob
import ffmpeg_streaming
import subprocess
from ffmpeg_streaming import Formats, Bitrate, Representation, Size

for path in glob.glob('*.mp4'):

	video = ffmpeg_streaming.input(path)
	name = path.replace('.mp4', '')


	subprocess.call(["ffmpeg", "-i", path, "-ss", "00:00:00.000", "-vframes", '1', name + ".jpg", "-y"], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

	# hls = video.hls(Formats.h264(), hls_time=6)

	# hls.auto_generate_representations()
	# hls.output(f'hls/{name}.m3u8')

	dash = video.dash(Formats.h264())
	dash.auto_generate_representations()
	dash.output(f'dash/{name}.mpd')


