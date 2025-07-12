import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState([]);
  const containerRef = useRef(null);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/newsBar/get`);
        setHeadlines(data.map(a => a.title));
      } catch (error) {
        console.error("فشل جلب الأخبار:", error);
      }
    }
    fetchNews();
  }, [apiBaseUrl]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.scrollWidth;
    let start = el.clientWidth;

    function animate() {
      start -= 1;
      if (start < -width) start = el.clientWidth;
      el.style.transform = `translateX(${start}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  }, [headlines]);

  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#780C28] text-white py-2 px-4 font-sans">
      <div
        ref={containerRef}
        className="inline-block will-change-transform"
      >
        {headlines.join('  •  ')}
      </div>
    </div>
  );
}
