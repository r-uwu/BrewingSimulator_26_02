// Card.jsx
const Card = ({ image, title, description, tag }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 transition-transform duration-300 hover:-translate-y-2">
      {/* 이미지 섹션 */}
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      
      {/* 콘텐츠 섹션 */}
      <div className="px-6 py-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mb-2 px-2.5 py-0.5 rounded">
          {tag}
        </span>
        <div className="font-bold text-xl mb-2 text-gray-800">{title}</div>
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* 푸터 섹션 */}
      <div className="px-6 pt-4 pb-6">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default Card;