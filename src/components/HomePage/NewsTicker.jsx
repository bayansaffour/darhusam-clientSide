import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await axios.get('http://localhost:5000/api/newsBar/get');
      setHeadlines(data.map(a => a.title));
    }
    fetchNews();
  }, []);

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


// // frontend/src/components/NewsTicker.jsx
// import React, { useEffect, useState, useRef } from 'react';

// export default function NewsTicker() {
//   // هنا حط أي عناوين بدك إياها
//   const customHeadlines = [
//     'عنوان الخبر الأول',
//     'خبر مهم رقم 2',
//     'تحديثات بالعالم العربي',
//     'خبر محلي من الموقع تبعي'
//   ];

//   const [headlines, setHeadlines] = useState(customHeadlines);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     // تظل الحركة نفسها
//     const el = containerRef.current;
//     if (!el) return;
//     const width = el.scrollWidth;
//     let start = el.clientWidth;
//     function animate() {
//       start -= 1;
//       if (start < -width) start = el.clientWidth;
//       el.style.transform = `translateX(${start}px)`;
//       requestAnimationFrame(animate);
//     }
//     animate();
//   }, [headlines]);

//   return (
//     <div className="overflow-hidden whitespace-nowrap bg-[#780C28] text-white py-2 px-4 font-sans">
//       <div ref={containerRef} className="inline-block will-change-transform">
//         {headlines.join('  •  ')}
//       </div>
//     </div>
//   );
// }

