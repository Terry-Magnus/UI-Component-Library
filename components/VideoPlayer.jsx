import { useEffect, useRef, useState } from "react";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaVolumeUp, FaVolumeMute, FaPause, FaPlay } from "react-icons/fa";
import { RiForward10Line, RiReplay10Fill } from "react-icons/ri";
import {
  MdOutlineFullscreen,
  MdFullscreenExit,
  MdClosedCaption,
  MdClosedCaptionDisabled,
  MdClose,
} from "react-icons/md";
import { BsFillPipFill } from "react-icons/bs";


const convertSecondsToMinSec = (seconds) => {
    const hr = Math.floor(Number(seconds) / 3600).toString().padStart(2, "0");
    const min = Math.floor((Number(seconds) % 3600) / 60).toString().padStart(2, "0");
    const sec = Math.floor(Number(seconds) % 60).toString().padStart(2, "0");


    if (isNaN(hr) || isNaN(min)) {
        return undefined;
    } else if (hr > 0) {
        return `${hr}:${min}:${sec}`;
    } else {
        return `${min}:${sec}`;
    }
};


export default function CustomVideoPlayer({ src, subtitlesUrl, onEnded }) {
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [currentCueIndex, setCurrentCueIndex] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0); // Percentage
  const [volume, setVolume] = useState(1); // From 0 to 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  // Update time and progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Load subtitles from VTT
  useEffect(() => {
    const loadVTT = async () => {
      const res = await fetch(subtitlesUrl);
      const text = await res.text();

      // regex to remove
      const cues = [
        ...text.matchAll(
          /(\d{2}:\d{2}:\d{2}.\d{3}) --> ([\d:.]+)\n([\s\S]+?)(?=\n{2,}|$)/g
        ),
      ].map(([, start, end, text]) => ({
        start: parseTime(start),
        end: parseTime(end),
        text: text.trim().replace("\n", " "),
      }));
      setSubtitles(cues);
    };

    if (subtitlesUrl) loadVTT();
  }, [subtitlesUrl]);

  const parseTime = (timeStr) => {
    const [h, m, s] = timeStr.split(":");
    const [sec, ms] = s.split(".");
    return +h * 3600 + +m * 60 + +sec + +ms / 1000;
  };

  // Sync current cue
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const current = video.currentTime;
      const index = subtitles.findIndex(
        (cue) => current >= cue.start && current <= cue.end
      );
      setCurrentCueIndex(index);
    }, 500);

    return () => clearInterval(interval);
  }, [subtitles]);

  // hide controls
  useEffect(() => {
    if (isFullscreen) {
      const handleMouseMove = () => {
        setShowControls(true);
        if (hideControlsTimer.current) {
          clearTimeout(hideControlsTimer.current);
        }
        hideControlsTimer.current = setTimeout(() => {
          setShowControls(false);
        }, 3000); // 3 seconds
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (hideControlsTimer.current) {
          clearTimeout(hideControlsTimer.current);
        }
      };
    }
  }, [isFullscreen]);

  // display loading spinner while buffering
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true); // buffering starts
    const handlePlaying = () => setIsBuffering(false); // playback resumes
    const handleCanPlay = () => setIsBuffering(false); // enough data loaded

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const skip = (sec) => {
    const video = videoRef.current;
    if (video) video.currentTime += sec;
  };

  // Seek bar handler
  const handleSeek = (e) => {
    const video = videoRef.current;
    const newProgress = parseFloat(e.target.value);
    if (!video || isNaN(video.duration)) return;
    video.currentTime = (newProgress / 100) * video.duration;
    setProgress(newProgress);
  };

  // Volume control
  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleVolume = () => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = video.volume > 0 ? 0 : 1;
    video.volume = newVol;
    setVolume(newVol);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (video && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    }
  };

  const handlePlaybackRate = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newPlaybackRate = parseFloat(e.target.value);
    video.playbackRate = newPlaybackRate;
    setPlaybackRate(newPlaybackRate);
  };

  const toggleCaptions = () => {
    if (trackRef.current) {
      const track = trackRef.current.track; // TextTrack
      if (track.mode === "showing") {
        track.mode = "disabled";
        setCaptionsEnabled(false);
      } else {
        track.mode = "showing";
        setCaptionsEnabled(true);
      }
    }
  };

  const shouldShowControls = isFullscreen || showControls;

  return (
    <div className="grid grid-cols-1 ">
      <div
        className="relative w-full max-w-4xl mx-auto text-white shadow-lg overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          crossOrigin="anonymous"
          controlsList="nodownload"
          onEnded={onEnded}
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={src} type="video/mp4" />
          <track
            ref={trackRef}
            kind="captions"
            srcLang="en"
            src={subtitlesUrl}
            default
          />
        </video>

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-gray border-accent" />
          </div>
        )}

        <div
          className={`${
            shouldShowControls
              ? "opacity-100"
              : "opacity-0  pointer-events-none"
          } w-full  bg-black/50 px-4 py-2 absolute bottom-0 left-0  z-10 transition-opacity duration-500 `}
        >
          {/* Progress Bar */}
          <div className="w-full">
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="w-full accent-green-500"
              min={0}
              max={100}
              step={0.1}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-between items-center py-2">
            <div className="flex gap-4 items-center py-2">
              <button
                title="Play"
                className="hover:text-accent"
                onClick={togglePlay}
              >
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
              </button>
              <button
                title="Rewind 10s"
                className="hover:text-accent"
                onClick={() => skip(-10)}
              >
                <RiReplay10Fill size={20} />
              </button>
              <button
                title="Forward 10s"
                className="hover:text-accent"
                onClick={() => skip(10)}
              >
                <RiForward10Line size={20} />
              </button>
              <span className="text-xs text-white">
                {convertSecondsToMinSec(currentTime)} /{" "}
                {convertSecondsToMinSec(duration)}
              </span>
              {/* Volume Slider */}
              <div className="flex items-center space-x-2 relative group">
                <button
                  onClick={toggleVolume}
                  className="text-white hover:text-accent"
                >
                  {volume > 0 ? (
                    <FaVolumeUp size={18} />
                  ) : (
                    <FaVolumeMute size={18} />
                  )}
                </button>

                <input
                  type="range"
                  title={volume * 100}
                  value={volume}
                  onChange={handleVolume}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-10 accent-green-500 cursor-pointer transition-hidden duration-300 hidden hover:block scale-90 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center py-2">
              <button
                className="hover:text-accent"
                title="Toggle Captions"
                onClick={toggleCaptions}
              >
                {captionsEnabled > 0 ? (
                  <MdClosedCaptionDisabled size={20} />
                ) : (
                  <MdClosedCaption size={20} />
                )}
              </button>
              <select
                title="Playback Rate"
                value={playbackRate}
                onChange={handlePlaybackRate}
                className="text-black"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={1.75}>1.75x</option>
                <option value={2.0}>2x</option>
              </select>

              <button onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <MdFullscreenExit size={18} />
                ) : (
                  <MdOutlineFullscreen size={18} />
                )}
              </button>
              <button
                className="hover:text-accent"
                title="Picture-in-picture mode"
                onClick={togglePiP}
              >
                <BsFillPipFill size={18} />
              </button>
              <button
                title="Transcript"
                className={`hover:text-accent ${
                  showTranscript ? "text-accent" : "text-white"
                }`}
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <IoDocumentTextSharp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {showTranscript && !isFullscreen && (
        <div className="  shadow-lg ">
          <div className="w-full p-4 bg-gray flex justify-between items-center">
            <p className="text-black font-semibold text-lg">Transcription</p>

            <button
              className="cursor-pointer"
              onClick={() => setShowTranscript(false)}
            >
              <MdClose size={18} />
            </button>
          </div>
          <div className="h-[300px] p-4 text-sm overflow-y-auto bg-white">
            {subtitles.map((cue, i) => (
              <div
                key={i}
                className={`py-1 hover:cursor-pointer ${
                  i === currentCueIndex
                    ? "text-accent font-semibold underline"
                    : "text-black"
                }`}
                onClick={() => {
                  if (videoRef.current)
                    videoRef.current.currentTime = cue.start;
                }}
              >
                {cue.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
