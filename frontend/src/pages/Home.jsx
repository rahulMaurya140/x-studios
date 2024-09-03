import React, { useState, useEffect } from "react";
import { useLocation,Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [sortOrderTime, setSortOrderTime] = useState("asc"); // State to track sorting order
  const [sortOrderComment, setSortOrderComment] = useState("asc"); // State to track sorting order
  const [sortOrderRetweet, setSortOrderRetweet] = useState("asc"); // State to track sorting order
  const [sortOrderLike, setSortOrderLike] = useState("asc"); // State to track sorting order
  const [totalTweets, setTotalTweets] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalRetweets, setTotalRetweets] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  const { state } = useLocation();
  const { searchedname } = state; // Read values passed on state

  const loadData = async () => {
    const response = await axios.get(`http://localhost:5000/api/get`, {
      params: {
        searchedname: searchedname,
      },
    });
    setData(response.data);
    calculateTotals(response.data);
  };

  const calculateTotals = (tweets) => {
    const totalTweetsCount = tweets.length;
    const totalCommentsCount = tweets.reduce(
      (sum, tweet) => sum + tweet.Comments,
      0
    );
    const totalRetweetsCount = tweets.reduce(
      (sum, tweet) => sum + tweet.Retweets,
      0
    );
    const totalLikesCount = tweets.reduce((sum, tweet) => sum + tweet.Likes, 0);

    setTotalTweets(totalTweetsCount);
    setTotalComments(totalCommentsCount);
    setTotalRetweets(totalRetweetsCount);
    setTotalLikes(totalLikesCount);
  };

  // Function to handle sorting
  const handleSortTime = () => {
    const sortedData = [...data]; // Create a copy of the data
    sortedData.sort((a, b) => {
      if (sortOrderTime === "asc") {
        return new Date(a.TimeStamp) - new Date(b.TimeStamp); // Sort in ascending order by TimeStamp
      } else {
        return new Date(b.TimeStamp) - new Date(a.TimeStamp); // Sort in descending order by TimeStamp
      }
    });
    setData(sortedData); // Update the data state with sorted data
    setSortOrderTime(sortOrderTime === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  const handleSortComment = () => {
    const sortedData = [...data]; // Create a copy of the data
    sortedData.sort((a, b) => {
      if (sortOrderComment === "asc") {
        return a.Comments - b.Comments; // Sort in ascending order by LikeCount
      } else {
        return b.Comments - a.Comments; // Sort in descending order by LikeCount
      }
    });
    setData(sortedData); // Update the data state with sorted data
    setSortOrderComment(sortOrderComment === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  const handleSortRetweet = () => {
    const sortedData = [...data]; // Create a copy of the data
    sortedData.sort((a, b) => {
      if (sortOrderRetweet === "asc") {
        return a.Retweets - b.Retweets; // Sort in ascending order by LikeCount
      } else {
        return b.Retweets - a.Retweets; // Sort in descending order by LikeCount
      }
    });
    setData(sortedData); // Update the data state with sorted data
    setSortOrderRetweet(sortOrderRetweet === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  const handleSortLike = () => {
    const sortedData = [...data]; // Create a copy of the data
    sortedData.sort((a, b) => {
      if (sortOrderLike === "asc") {
        return a.Likes - b.Likes; // Sort in ascending order by LikeCount
      } else {
        return b.Likes - a.Likes; // Sort in descending order by LikeCount
      }
    });
    setData(sortedData); // Update the data state with sorted data
    setSortOrderLike(sortOrderLike === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ marginTop: "50px" }}>
      {/* <Link className="set-user" to = "/">Set User</Link> */}
      <div id = "heading-container" style={{ marginTop: "50px" }}>
        <div className="total-boxes">
          <div className="total-box">
            <div className="total-title">Σ Tweets</div>
            <div className="total-count">{totalTweets}</div>
          </div>
          <div className="total-box">
            <div className="total-title">Σ Comments</div>
            <div className="total-count">{totalComments}</div>
          </div>
        </div>

        <div className="heading-and-user">
          <h1 className = "titleX neonText">
            &#120143; Studio
          </h1>
          <h1 style={{ color: "red", textDecoration: "underline" }}>
            Hello, {searchedname}
          </h1>
        </div>

        <div className="total-boxes">
          <div className="total-box">
            <div className="total-title">Σ Retweets</div>
            <div className="total-count">{totalRetweets}</div>
          </div>
          <div className="total-box">
            <div className="total-title">Σ Likes</div>
            <div className="total-count">{totalLikes}</div>
          </div>
        </div>
        {/* Rest of your table code */}
      </div>


      {/* <button onClick={handleSort}>
        Sort by LikeCount ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button> */}
      <table className="styled-table">
        <thead>
          <tr>
            <td style={{ textAlign: "center" }}>
              {" "}
              <button onClick={handleSortTime}>
                {sortOrderTime === "asc" ? "↑ Desc" : "↓ Asc"}
              </button>{" "}
            </td>
            <td style={{ textAlign: "center" }}></td>
            <td style={{ textAlign: "center" }}>
              {" "}
              <button onClick={handleSortComment}>
                {sortOrderComment === "asc" ? "↑ Desc" : "↓ Asc"}
              </button>{" "}
            </td>
            <td style={{ textAlign: "center" }}>
              {" "}
              <button onClick={handleSortRetweet}>
                {sortOrderRetweet === "asc" ? "↑ Desc" : "↓ Asc"}
              </button>{" "}
            </td>
            <td style={{ textAlign: "center" }}>
              {" "}
              <button onClick={handleSortLike}>
                {sortOrderLike === "asc" ? "↑ Desc" : "↓ Asc"}
              </button>{" "}
            </td>
            <td style={{ textAlign: "center" }}></td>
          </tr>
          <tr className="tweet-analytics-heading">
            <th style={{ textAlign: "center" }}>TimeStamp </th>
            <th style={{ textAlign: "center" }}>Tweet</th>
            <th style={{ textAlign: "center" }}>CommentCount</th>
            <th style={{ textAlign: "center" }}>RetweetCount</th>
            <th style={{ textAlign: "center" }}>LikeCount</th>
            <th style={{ textAlign: "center" }}>ViewCount</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.TimeStamp}>
                <td>{item.TimeStamp}</td>
                <td>{item.Tweet}</td>
                <td>{item.Comments}</td>
                <td>{item.Retweets}</td>
                <td>{item.Likes}</td>
                <td>{item.Views}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
