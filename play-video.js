const API_KEY = "AIzaSyD6l43hQeWOe4qu3jMC47vthKR8kzPjeBw";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const parentNode = document.getElementById("playframe");

let videoId = document.cookie.split("=")[1];
const commentsContainer = document.getElementById("comments-container");

window.addEventListener("load", () => {
  if (YT) {
    new YT.Player("play-frame", {
      width: "100%",
      height: "50%",
      videoId,
    });
    loadInfo(videoId);
    loadComments(videoId);
  }
});

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

function renderVideoDetails(data1, data2) {
  let div = document.createElement("div");
  div.className = "videoDetails";
  div.innerHTML = `
  <h2>${data1.snippet.title}</h2>
  <p>${formatViewCount(data2.statistics.viewCount)} views . ${calcTheTimeGap(
    data1.snippet.publishedAt
  )}</p>
  `;

  parentNode.insertBefore(div, commentsContainer);
}

async function loadInfo(videoId) {
  let endpoint1 = `${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`;
  let endpoint2 = `${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`;

  const response1 = await fetch(endpoint1);
  const response2 = await fetch(endpoint2);
  const result1 = await response1.json();
  const result2 = await response2.json();
  const data1 = result1.items[0];
  const data2 = result2.items[0];
  console.log(result1.items[0]);
  console.log(result2.items[0]);
  renderVideoDetails(data1, data2);
}

async function loadComments(videoId) {
  let endpoint = `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=10&part=snippet`;

  const response = await fetch(endpoint);
  const result = await response.json();
  //   console.log(result);

  result.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      likeCount,
      authorProfileImageUrl: profileUrl,
      publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
    <div id="comment-profile">  
      <img src="${profileUrl}" class="author-profile" alt="author profile" />
    </div>
    <div id="comment-details">  
      <b>${authorDisplayName} <span id="commment-time">${calcTheTimeGap(
      publishedAt
    )}</span></b>
      <p>${textDisplay}</p>
    </div>`;
    commentsContainer.appendChild(div);
  });
}
