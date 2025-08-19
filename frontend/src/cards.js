
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// // --- MOCK DATA (for local testing, to be replaced by API) ---
// // Note: This mock data is used as a fallback if the API call fails or for initial state.
// // In a real application, you would remove this and rely entirely on the API.
// const newsData = [
//   { id: 1, title: "Global Markets Rally on Tech Gains", subtitle: "NASDAQ hits an all-time high.", type: "Business", summary: "Strong earnings reports from major tech companies have fueled a significant rally in global stock markets, with investors showing renewed confidence.", content: "The rally was led by semiconductor and software stocks. Analysts believe this trend could continue as digital transformation accelerates across all industries, boosting demand for tech infrastructure and services." },
//   { id: 2, title: "Supply Chain Innovations Post-Pandemic", subtitle: "Logistics firms adopt AI and automation.", type: "Business", summary: "Companies are investing heavily in new technologies to build more resilient and efficient supply chains in response to recent global disruptions.", content: "AI-powered demand forecasting and automated warehouse robotics are becoming standard. This shift aims to reduce delivery times, minimize human error, and provide better real-time tracking for goods in transit." },
//   { id: 3, title: "Sci-Fi Epic 'Nebula's End' Dominates Box Office", subtitle: "Breaks opening weekend records.", type: "Entertainment", summary: "The highly anticipated space opera 'Nebula's End' has captivated audiences worldwide, securing the biggest global box office opening of the year.", content: "With stunning visual effects and a compelling storyline, the film is praised by critics and audiences alike. Its success is seen as a major win for original storytelling in an era of sequels and reboots." },
//   { id: 4, title: "New Streaming Service Focuses on Indie Films", subtitle: "A new platform for independent creators.", type: "Entertainment", summary: "'Cineverse' launched this week, offering a curated library of independent films and documentaries from around the world.", content: "The service aims to provide a dedicated space for filmmakers outside the mainstream studio system, offering a revenue-sharing model that is more favorable to creators. It's a bold move in a crowded streaming market." },
//   { id: 5, title: "International Climate Accord Reached", subtitle: "Nations agree to new emission targets.", type: "Politics", summary: "After weeks of intense negotiations, world leaders have signed a new climate agreement aimed at accelerating the transition to renewable energy.", content: "The accord includes binding commitments for reducing carbon emissions by 2035 and establishing a global fund to help developing nations with green technology adoption. Critics, however, argue the targets are not ambitious enough." },
//   { id: 6, title: "Digital Privacy Bill Moves to Final Vote", subtitle: "Landmark legislation on data protection.", type: "Politics", summary: "A comprehensive new bill regulating how tech companies collect and use personal data is heading for a final legislative vote next week.", content: "The bill would grant users the right to access and delete their data, and require explicit consent for data sharing. Tech lobbyists have been actively campaigning against certain provisions, citing innovation concerns." },
//   { id: 7, title: "Underdogs Clinch Championship in Final Seconds", subtitle: "A historic victory for the city.", type: "Sport", summary: "In a stunning upset, the Ravens won the national championship with a last-second field goal, concluding a true Cinderella season.", content: "The team, which was ranked last at the start of the season, defied all odds with a combination of grit and brilliant coaching. The victory parade is expected to draw millions of fans to the city streets." },
//   { id: 8, title: "New Analytics Tech Changing a Century-Old Game", subtitle: "How data is revolutionizing baseball.", type: "Sport", summary: "Teams are now relying on advanced player-tracking data and predictive analytics to make strategic decisions on and off the field.", content: "From defensive shifts to pitcher-batter matchups, every aspect of the game is now influenced by data. This has led to a new breed of front-office executives and a different style of play on the diamond." },
//   { id: 9, title: "The Rise of Generative AI in Creative Fields", subtitle: "AI tools are now co-creating art and music.", type: "Tech", summary: "Generative AI models are becoming powerful tools for artists, designers, and musicians, sparking a debate about creativity and authorship.", content: "These tools can generate photorealistic images from text prompts, compose original music, and even write poetry. While some creatives embrace AI as a collaborator, others are concerned about its impact on their profession." },
//   { id: 10, title: "Next-Gen Battery Tech Promises 1000-Mile EV", subtitle: "A breakthrough in solid-state batteries.", type: "Tech", summary: "A startup has unveiled a new solid-state battery prototype that could dramatically increase the range and reduce the charging time of electric vehicles.", content: "Unlike current lithium-ion batteries, solid-state batteries are more energy-dense, safer, and longer-lasting. If scalable, this technology could eliminate 'range anxiety' and accelerate the global adoption of EVs." },
// ];

// // --- HELPER FUNCTION to generate dynamic image URLs from Picsum Photos ---
// const getImageUrl = (id) => {
//   return `https://picsum.photos/seed/${id}/600/400`;
// };

// // --- NEWS CARD COMPONENT (MODIFIED to be clickable) ---
// const NewsCard = ({ article }) => {
//   const navigate = useNavigate();
//   const typeColorMap = {
//     'Tech': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
//     'Business': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
//     'Entertainment': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
//     'Politics': 'bg-red-500/10 text-red-400 border-red-500/30',
//     'Sport': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
//   };

//   const handleClick = () => {
//     navigate(`/article/${article.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="bg-slate-800/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer"
//     >
//       <img
//         src={getImageUrl(article.id)}
//         alt={article.title}
//         className="w-full h-48 object-cover"
//         onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/334155/94a3b8?text=Image+Error'; }}
//       />
//       <div className="p-6">
//         <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border ${typeColorMap[article.article_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
//           {article.article_type}
//         </span>
//         <h3 className="text-xl font-bold text-slate-100 mb-2">{article.title}</h3>
//         <p className="text-sm text-slate-400 mb-4">{article.subtitle}</p>
//         <div className="text-slate-300 text-sm">
//           <p>{article.summary}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- NEWS SHOW COMPONENT (MODIFIED) ---
// export const NewsShow = () => {
//   const [articles, setArticles] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);

//   const observerTargetRef = useRef(null);
//   const { article_type } = useParams();

//   // Fetches news data from the API with pagination
//   const fetchNews = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`http://localhost:8000/api/news/type/${article_type}/?page=${page}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const { results: newArticles } = await response.json();

//       if (newArticles.length > 0) {
//         setArticles(prevArticles => [...prevArticles, ...newArticles]);
//         setPage(prevPage => prevPage + 1);
//       } else {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error("Failed to fetch news:", error);
//       if (articles.length === 0) {
//         setArticles(newsData);
//         setHasMore(false);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [page, article_type, articles.length]);

//   // Sets up the Intersection Observer to trigger infinite scrolling
//   useEffect(() => {
//     if (isLoading || !hasMore) {
//       return;
//     }

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           fetchNews();
//         }
//       },
//       {
//         root: null,
//         threshold: 0.1,
//       }
//     );

//     const currentTarget = observerTargetRef.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) {
//         observer.unobserve(currentTarget);
//       }
//     };
//   }, [isLoading, hasMore, fetchNews]);

//   // Resets state and fetches first page when article_type changes
//   useEffect(() => {
//     setArticles([]);
//     setPage(1);
//     setHasMore(true);
//     // A small delay to ensure state is reset before fetching
//     const timeout = setTimeout(() => fetchNews(), 50); 
//     return () => clearTimeout(timeout);
//   }, [article_type]);

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
//       <div className="max-w-screen-2xl mx-auto">
//         <header className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
//             {article_type ? `${article_type} News` : `Today's Headlines`}
//           </h1>
//           <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
//               A curated feed of the latest news across business, entertainment, politics, and more.
//           </p>
//         </header>

//         <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
//           {articles.map(article => (
//             <NewsCard key={article.id} article={article} />
//           ))}
//         </main>

//         <div ref={observerTargetRef} className="h-10"></div>

//         {isLoading && (
//           <div className="text-center py-8">
//             <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <p className="text-slate-400 mt-2">Loading more news...</p>
//           </div>
//         )}

//         {!hasMore && !isLoading && (
//           <div className="text-center py-8 text-slate-500">
//             <p>You've reached the end of the news feed. 🗞️</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- NEW ARTICLE DETAIL COMPONENT ---
// export const ArticleDetail = () => {
//   const { id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchArticleAndRecommendations = async () => {
//       setIsLoading(true);
//       setError(null);

//       // Fetch the main article
//       try {
//         const articleResponse = await fetch(`http://localhost:8000/api/news/${id}/`);
//         if (!articleResponse.ok) {
//           throw new Error(`HTTP error! status: ${articleResponse.status}`);
//         }
//         const articleData = await articleResponse.json();
//         setArticle(articleData);
//       } catch (e) {
//         const mockArticle = newsData.find(a => a.id === parseInt(id));
//         if (mockArticle) {
//           setArticle(mockArticle);
//         } else {
//           setError("Failed to fetch article. Please check the ID.");
//         }
//         console.error("Failed to fetch article:", e);
//       } finally {
//         setIsLoading(false);
//       }

//       // Fetch recommendations separately to handle potential failures independently
//       try {
//             // path('articles/<int:article_id>/recommend/', RecommendationView.as_view(), name='article-recommendations'),

//         const recResponse = await fetch(`http://localhost:8000/api/articles/${id}/recommend/`);
//         if (!recResponse.ok) {
//           throw new Error(`HTTP error! status: ${recResponse.status}`);
//         }
//         const recData = await recResponse.json();
//         setRecommendations(recData);
//       } catch (e) {
//         console.error("Failed to fetch recommendations:", e);
//         // Fallback to mock data for recommendations or set empty
//         const mockRecs = newsData.filter(a => a.id !== parseInt(id)).slice(0, 6);
//         setRecommendations(mockRecs);
//       }
//     };
//     fetchArticleAndRecommendations();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-slate-900 font-sans text-white flex items-center justify-center">
//         <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//         <p className="ml-4">Loading article...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-900 font-sans text-white p-6 flex flex-col items-center justify-center">
//         <p className="text-xl text-red-400">{error}</p>
//         <Link to="/news/all" className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">Go back to news feed</Link>
//       </div>
//     );
//   }

//   if (!article) {
//     return (
//       <div className="min-h-screen bg-slate-900 font-sans text-white p-6 flex flex-col items-center justify-center">
//         <p className="text-xl text-slate-400">Article not found.</p>
//         <Link to="/news/all" className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">Go back to news feed</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
//       <div className="max-w-screen-lg mx-auto bg-slate-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
//         {/* Main Article Content */}
//         <img
//           src={getImageUrl(article.id)}
//           alt={article.title}
//           className="w-full h-80 object-cover rounded-t-xl"
//           onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x500/334155/94a3b8?text=Image+Error'; }}
//         />
//         <div className="p-8">
//           <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
//             {article.article_type}
//           </span>
//           <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">{article.title}</h1>
//           <h2 className="text-xl text-slate-400 mb-6">{article.subtitle}</h2>
//           <p className="text-base sm:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
//             {article.content}
//           </p>
//           <div className="mt-8 text-right">
//             <Link to="/news/all" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
//               &larr; Back to all news
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Recommended Articles Section */}
//       {recommendations.length > 0 && (
//         <div className="max-w-screen-2xl mx-auto mt-12">
//           <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center">
//             Recommended for you
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
//             {recommendations.map(recArticle => (
//               <NewsCard key={recArticle.id} article={recArticle} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// --- MOCK DATA (for local testing, to be replaced by API) ---
// Note: This mock data is used as a fallback if the API call fails or for initial state.
// In a real application, you would remove this and rely entirely on the API.
const newsData = [
  { id: 1, title: "Global Markets Rally on Tech Gains", subtitle: "NASDAQ hits an all-time high.", type: "Business", summary: "Strong earnings reports from major tech companies have fueled a significant rally in global stock markets, with investors showing renewed confidence.", content: "The rally was led by semiconductor and software stocks. Analysts believe this trend could continue as digital transformation accelerates across all industries, boosting demand for tech infrastructure and services." },
  { id: 2, title: "Supply Chain Innovations Post-Pandemic", subtitle: "Logistics firms adopt AI and automation.", type: "Business", summary: "Companies are investing heavily in new technologies to build more resilient and efficient supply chains in response to recent global disruptions.", content: "AI-powered demand forecasting and automated warehouse robotics are becoming standard. This shift aims to reduce delivery times, minimize human error, and provide better real-time tracking for goods in transit." },
  { id: 3, title: "Sci-Fi Epic 'Nebula's End' Dominates Box Office", subtitle: "Breaks opening weekend records.", type: "Entertainment", summary: "The highly anticipated space opera 'Nebula's End' has captivated audiences worldwide, securing the biggest global box office opening of the year.", content: "With stunning visual effects and a compelling storyline, the film is praised by critics and audiences alike. Its success is seen as a major win for original storytelling in an era of sequels and reboots." },
  { id: 4, title: "New Streaming Service Focuses on Indie Films", subtitle: "A new platform for independent creators.", type: "Entertainment", summary: "'Cineverse' launched this week, offering a curated library of independent films and documentaries from around the world.", content: "The service aims to provide a dedicated space for filmmakers outside the mainstream studio system, offering a revenue-sharing model that is more favorable to creators. It's a bold move in a crowded streaming market." },
  { id: 5, title: "International Climate Accord Reached", subtitle: "Nations agree to new emission targets.", type: "Politics", summary: "After weeks of intense negotiations, world leaders have signed a new climate agreement aimed at accelerating the transition to renewable energy.", content: "The accord includes binding commitments for reducing carbon emissions by 2035 and establishing a global fund to help developing nations with green technology adoption. Critics, however, argue the targets are not ambitious enough." },
  { id: 6, title: "Digital Privacy Bill Moves to Final Vote", subtitle: "Landmark legislation on data protection.", type: "Politics", summary: "A comprehensive new bill regulating how tech companies collect and use personal data is heading for a final legislative vote next week.", content: "The bill would grant users the right to access and delete their data, and require explicit consent for data sharing. Tech lobbyists have been actively campaigning against certain provisions, citing innovation concerns." },
  { id: 7, title: "Underdogs Clinch Championship in Final Seconds", subtitle: "A historic victory for the city.", type: "Sport", summary: "In a stunning upset, the Ravens won the national championship with a last-second field goal, concluding a true Cinderella season.", content: "The team, which was ranked last at the start of the season, defied all odds with a combination of grit and brilliant coaching. The victory parade is expected to draw millions of fans to the city streets." },
  { id: 8, title: "New Analytics Tech Changing a Century-Old Game", subtitle: "How data is revolutionizing baseball.", type: "Sport", summary: "Teams are now relying on advanced player-tracking data and predictive analytics to make strategic decisions on and off the field.", content: "From defensive shifts to pitcher-batter matchups, every aspect of the game is now influenced by data. This has led to a new breed of front-office executives and a different style of play on the diamond." },
  { id: 9, title: "The Rise of Generative AI in Creative Fields", subtitle: "AI tools are now co-creating art and music.", type: "Tech", summary: "Generative AI models are becoming powerful tools for artists, designers, and musicians, sparking a debate about creativity and authorship.", content: "These tools can generate photorealistic images from text prompts, compose original music, and even write poetry. While some creatives embrace AI as a collaborator, others are concerned about its impact on their profession." },
  { id: 10, title: "Next-Gen Battery Tech Promises 1000-Mile EV", subtitle: "A breakthrough in solid-state batteries.", type: "Tech", summary: "A startup has unveiled a new solid-state battery prototype that could dramatically increase the range and reduce the charging time of electric vehicles.", content: "Unlike current lithium-ion batteries, solid-state batteries are more energy-dense, safer, and longer-lasting. If scalable, this technology could eliminate 'range anxiety' and accelerate the global adoption of EVs." },
];

// --- HELPER FUNCTION to generate dynamic image URLs from Picsum Photos ---
const getImageUrl = (id) => {
  return `https://picsum.photos/seed/${id}/600/400`;
};

// --- NEWS CARD COMPONENT (MODIFIED to be clickable) ---
const NewsCard = ({ article }) => {
  const navigate = useNavigate();
  const typeColorMap = {
    'Tech': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Business': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Entertainment': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    'Politics': 'bg-red-500/10 text-red-400 border-red-500/30',
    'Sport': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  };

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer"
    >
      <img
        src={getImageUrl(article.id)}
        alt={article.title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/334155/94a3b8?text=Image+Error'; }}
      />
      <div className="p-6">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border ${typeColorMap[article.type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
          {article.type}
        </span>
        <h3 className="text-xl font-bold text-slate-100 mb-2">{article.title}</h3>
        <p className="text-sm text-slate-400 mb-4">{article.subtitle}</p>
        <div className="text-slate-300 text-sm">
          <p>{article.summary}</p>
        </div>
      </div>
    </div>
  );
};

// --- NEWS SHOW COMPONENT (MODIFIED) ---
export const NewsShow = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observerTargetRef = useRef(null);
  const { article_type } = useParams();

  // Fetches news data from the API with pagination
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/news/type/${article_type}/?page=${page}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { results: newArticles } = await response.json();

      if (newArticles.length > 0) {
        setArticles(prevArticles => [...prevArticles, ...newArticles]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
      if (articles.length === 0) {
        setArticles(newsData);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, article_type, articles.length]);

  // Sets up the Intersection Observer to trigger infinite scrolling
  useEffect(() => {
    if (isLoading || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNews();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoading, hasMore, fetchNews]);

  // Resets state and fetches first page when article_type changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    // A small delay to ensure state is reset before fetching
    const timeout = setTimeout(() => fetchNews(), 50);
    return () => clearTimeout(timeout);
  }, [article_type]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {article_type ? `${article_type} News` : `Today's Headlines`}
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            A curated feed of the latest news across business, entertainment, politics, and more.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </main>

        <div ref={observerTargetRef} className="h-10"></div>

        {isLoading && (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400 mt-2">Loading more news...</p>
          </div>
        )}

        {!hasMore && !isLoading && (
          <div className="text-center py-8 text-slate-500">
            <p>You've reached the end of the news feed. 🗞️</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- NEW ARTICLE DETAIL COMPONENT ---
export const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleAndRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch the main article
      try {
        const articleResponse = await fetch(`http://localhost:8000/api/news/${id}/`);
        if (!articleResponse.ok) {
          throw new Error(`HTTP error! status: ${articleResponse.status}`);
        }
        const articleData = await articleResponse.json();
        setArticle(articleData);
      } catch (e) {
        const mockArticle = newsData.find(a => a.id === parseInt(id));
        if (mockArticle) {
          setArticle(mockArticle);
        } else {
          setError("Failed to fetch article. Please check the ID.");
        }
        console.error("Failed to fetch article:", e);
      } finally {
        setIsLoading(false);
      }

      // Fetch recommendations separately to handle potential failures independently
      try {
        const recResponse = await fetch(`http://localhost:8000/api/recommendations/${id}/`);
        if (!recResponse.ok) {
          throw new Error(`HTTP error! status: ${recResponse.status}`);
        }
        const recData = await recResponse.json();
        setRecommendations(recData);
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
        // Fallback to mock data for recommendations or set empty
        const mockRecs = newsData.filter(a => a.id !== parseInt(id)).slice(0, 6);
        setRecommendations(mockRecs);
      }
    };
    fetchArticleAndRecommendations();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-white flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-4">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-white p-6 flex flex-col items-center justify-center">
        <p className="text-xl text-red-400">{error}</p>
        <Link to="/news/all" className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">Go back to news feed</Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-white p-6 flex flex-col items-center justify-center">
        <p className="text-xl text-slate-400">Article not found.</p>
        <Link to="/news/all" className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">Go back to news feed</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-lg mx-auto bg-slate-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
        {/* Main Article Content */}
        <img
          src={getImageUrl(article.id)}
          alt={article.title}
          className="w-full h-80 object-cover rounded-t-xl"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x500/334155/94a3b8?text=Image+Error'; }}
        />
        <div className="p-8">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            {article.type}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">{article.title}</h1>
          <h2 className="text-xl text-slate-400 mb-6">{article.subtitle}</h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </p>
          <div className="mt-8 text-right">
            <Link to="/news/all" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
              &larr; Back to all news
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Articles Section */}
      {recommendations.length > 0 && (
        <div className="max-w-screen-2xl mx-auto mt-12">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {recommendations.map(recArticle => (
              <NewsCard key={recArticle.id} article={recArticle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- NEW SEARCH COMPONENT ---
export const Search = () => {
  const { query } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchSearchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/search/?q=${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (e) {
        console.error("Failed to fetch search results:", e);
        setError("Failed to load search results. Please try again later.");
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Search Results for "{query}"
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Top articles matching your search query.
          </p>
        </header>

        {isLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400 mt-2">Searching...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <p>{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {articles.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </main>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No articles found for your search. 😔</p>
            <p className="mt-2">Try a different query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// // --- GLOBAL NAVIGATION HEADER COMPONENT ---
// const GlobalHeader = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
//       setSearchTerm('');
//     }
//   };

//   return (
//     <header className="bg-slate-950 p-4 sticky top-0 z-50 shadow-lg">
//       <div className="flex flex-col sm:flex-row justify-between items-center max-w-screen-2xl mx-auto">
//         <Link to="/news/all" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 sm:mb-0">
//           News Portal
//         </Link>
//         <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search news..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-64 px-4 py-2 bg-slate-800 text-white rounded-l-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//           />
//           <button
//             type="submit"
//             className="bg-cyan-500 text-white px-4 py-2 rounded-r-md hover:bg-cyan-600 transition-colors"
//           >
//             Search
//           </button>
//         </form>
//       </div>
//     </header>
//   );
// };


// --- MAIN APP COMPONENT ---
// export default function App() {
//   return (
//     <Router>
//       <GlobalHeader />
//       <Routes>
//         <Route path="/news/:article_type" element={<NewsShow />} />
//         <Route path="/article/:id" element={<ArticleDetail />} />
//         <Route path="/search/:query" element={<Search />} />
//         <Route path="*" element={<NewsShow />} />
//       </Routes>
//     </Router>
//   );
// }
