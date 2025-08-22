/**
 * VideoPlayer
 * @param videoUrl - youtubeのURL
 * @returns  動画再生HTML文字列
 */
export default function VideoPlayer(videoUrl: string) {
  /**
   * 正規表現を使ってYouTube URLからビデオIDを抽出する関数
   * @param url - YouTubeのURL
   * @returns
   */
  function getYouTubeVideoId(url: string) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  }

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}`; // 最後に&autoplay=1で自動再生されるようにできる。

  return `
    <div class="video-container">
      <iframe
        width="560"
        height="315"
        class="max-w-full"
        src="${embedUrl}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    `;
}
