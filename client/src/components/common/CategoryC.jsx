import { useNavigate } from 'react-router-dom';
function CategoryC({img, title, link}) {
    const navigate = useNavigate();
  return (
    
    <div className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition">
        <img src={img} alt={title} className="w-full h-60 object-cover" decoding="async"/>
      <div className="mt-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold m-0.5">{title}</h2>
        <button onClick={() => navigate(link)} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"> View more</button>
           
         
      </div>
    </div>
  );
}

export default CategoryC;
