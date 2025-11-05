/**
 * 正規表現を使ってYouTube URLからビデオIDを抽出する関数
 * @param url - YouTubeのURL
 * @returns ビデオID
 */
function getYouTubeVideoId(url: string): string {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
}

/**
 * ユニークなプレイヤーIDを生成
 */
let playerIdCounter = 0;
function generatePlayerId(): string {
  return `yt-player-${Date.now()}-${playerIdCounter++}`;
}

/**
 * グローバルなプレイヤー管理
 */
const playerQueue: Array<{
  playerId: string;
  videoId: string;
}> = [];

/**
 * YouTube IFrame Player APIが読み込まれたかどうか
 */
let apiLoaded = false;
let apiLoading = false;

/**
 * YouTube IFrame Player APIを読み込む
 */
export function loadYouTubeAPI(): void {
  if (apiLoaded || apiLoading) return;

  apiLoading = true;
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
}

/**
 * YouTube IFrame Player APIの準備完了コールバック
 * グローバルスコープに設定する必要がある
 */
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: typeof YT;
  }
}

// APIが読み込まれたときのコールバック
window.onYouTubeIframeAPIReady = () => {
  apiLoaded = true;
  // キューに溜まっているプレイヤーを初期化
  playerQueue.forEach(({ playerId, videoId }) => {
    initializePlayer(playerId, videoId);
  });
  playerQueue.length = 0;
};

/**
 * プレイヤーを初期化する関数
 */
function initializePlayer(playerId: string, videoId: string): void {
  if (!window.YT) return;

  new window.YT.Player(playerId, {
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      mute: 1,
      playsinline: 1,
      loop: 1,
      playlist: videoId,
    },
    events: {
      onReady: (event: YT.PlayerEvent) => {
        // 再生速度を0.75倍に設定
        event.target.setPlaybackRate(0.75);
        // 画質を720pに設定
        event.target.setPlaybackQuality("hd720");
      },
    },
  });
}

/**
 * VideoPlayer
 * @param videoUrl - youtubeのURL
 * @returns 動画再生HTML文字列
 */
export default function VideoPlayer(videoUrl: string): string {
  const videoId = getYouTubeVideoId(videoUrl);
  const playerId = generatePlayerId();

  // プレイヤーをキューに追加
  if (apiLoaded) {
    // APIがすでに読み込まれている場合はすぐに初期化
    setTimeout(() => initializePlayer(playerId, videoId), 0);
  } else {
    // APIがまだ読み込まれていない場合はキューに追加
    playerQueue.push({ playerId, videoId });
  }

  return `
    <div class="video-container">
      <div id="${playerId}" style="width: 100%; max-width: 56rem; aspect-ratio: 16/9;"></div>
    </div>
  `;
}

// このモジュールがインポートされたときに自動的にYouTube APIを読み込む
loadYouTubeAPI();
