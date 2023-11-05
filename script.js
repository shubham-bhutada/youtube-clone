const container = document.getElementById("container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const API_KEY = "AIzaSyD6l43hQeWOe4qu3jMC47vthKR8kzPjeBw";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function fetchVideo(searchQuery) {
  const endpoint = `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=40&part=snippet`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    console.log(result);

    for (let i = 0; i < result.items.length; i++) {
      let currentVideoId = result.items[i].id.videoId;
      let channelId = result.items[0].snippet.channelId;
      const currentVideoStatistics = await getVideoStats(currentVideoId);
      const channelLogo = await getChannelLogo(channelId);
      result.items[i].statistics = currentVideoStatistics;
      result.items[i].channelLogo = channelLogo;
    }
    renderVideo(result.items);
  } catch (error) {
    console.log("Some error occured");
  }
}

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  fetchVideo(searchValue);
});

async function getVideoStats(videoId) {
  const endpoint = `${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    // console.log(result);
    return result.items[0].statistics;
  } catch (error) {
    console.log(`failed to fetch the statistics for ${videoId}`);
  }
}
// getVideoStats("O0aSwKeusZM");

async function getChannelLogo(channelId) {
  const endpoint = `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    // console.log(result);
    return result.items[0].snippet.thumbnails.high.url;
  } catch {
    console.log(`failed to load channel logo for ${channelId}`);
  }
}

function navigateToVideoDetails(videoId) {
  document.cookie = `id=${videoId}; path=/play-video.html`;
  window.location.href = "play-video.html";
}

function renderVideo(videosList) {
  container.innerHTML = "";
  videosList.forEach((video) => {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video";
    videoContainer.innerHTML = `
        <img
            src="${video.snippet.thumbnails.high.url}"
            alt="thumbnail"
            class="thumbnail"
        />
        <div class="video-details">
          <div class="channel-logo">
            <img
              src="${video.channelLogo}"
              alt="channel-logo"
            />
          </div>
          <div class="more-details">
            <h6 class="title">${video.snippet.title}</h6>
            <p class="gray-text" id="artist">${video.snippet.channelTitle}</p>
            <p class="gray-text" id="vid-stats">${formatViewCount(
              video.statistics.viewCount
            )} views . ${calcTheTimeGap(video.snippet.publishTime)}</p>
          </div>
        </div>`;
    container.addEventListener("click", () => {
      navigateToVideoDetails(video.id.videoId);
    });
    container.appendChild(videoContainer);
  });
}

function calcTheTimeGap(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerHour = 60 * 60;
  const secondsPerDay = 24 * secondsPerHour;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap < secondsPerHour) {
    return `${Math.ceil(secondsGap / 60)} mins ago`;
  }
  if (secondsGap < secondsPerDay) {
    return `${Math.ceil(secondsGap / (60 * 60))} hrs ago`;
  }
  if (secondsGap < secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
  }
  if (secondsGap < secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
  }

  return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
}

function formatViewCount(viewCount) {
  if (viewCount < 1000) {
    return viewCount.toString();
  } else if (viewCount < 1000000) {
    return (viewCount / 1000).toFixed(1) + "K";
  } else if (viewCount < 1000000000) {
    return (viewCount / 1000000).toFixed(1) + "M";
  } else {
    return (viewCount / 1000000000).toFixed(1) + "B";
  }
}

/*
{
    "kind": "youtube#searchResult",
    "etag": "0uTmDjaCDe5noYZkZK72FLUVNu4",
    "id": {
        "kind": "youtube#video",
        "videoId": "cLgsRbttrJs"
    },
    "snippet": {
        "publishedAt": "2023-11-02T14:30:17Z",
        "channelId": "UCBIT1FSJW6yTlzqK-31FDWg",
        "title": "Daya ने क्यों मारा Jetha के पेट पे मुक्का? | Taarak Mehta Ka Ooltah Chashmah | Revisit The Journey",
        "description": "Click here to Subscribe to LIV Comedy: https://www.youtube.com/channel/UCBIT1FSJW6yTlzqK-31FDWg?sub_confirmation=1 ...",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/cLgsRbttrJs/default.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/cLgsRbttrJs/mqdefault.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/cLgsRbttrJs/hqdefault.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "LIV Comedy",
        "liveBroadcastContent": "none",
        "publishTime": "2023-11-02T14:30:17Z"
    }
}
*/

window.addEventListener("load", fetchVideo(""));

/* on running getVideoStats
{
    "kind": "youtube#videoListResponse",
    "etag": "xRmd1tBlLrP1IGFtHA7F_vzsx6Y",
    "items": [
        {
            "kind": "youtube#video",
            "etag": "A_wV4zXW8xKWErtPeL3rkwoypqE",
            "id": "O0aSwKeusZM",
            "statistics": {
                "viewCount": "794755",
                "likeCount": "7796",
                "favoriteCount": "0",
                "commentCount": "157"
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    }
}
*/
