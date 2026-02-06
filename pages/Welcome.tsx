import React from 'react';
import { View } from '../App';

interface WelcomeProps {
  onNavigate: (view: View) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-full min-h-screen bg-white dark:bg-zinc-900 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-yellow-50/50 to-transparent dark:from-yellow-900/10 dark:to-transparent pointer-events-none z-0"></div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-8 pt-12 pb-6 z-10">
        <div className="text-center mb-6 mt-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            连接互联网<br />的未来
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            加入互联网应用协会，与成千上万名行业精英一起探讨前沿技术、分享应用案例。
          </p>
        </div>

        {/* Carousel Indicators (Mock) */}
        <div className="flex justify-center items-center gap-2 mb-10">
          <div className="h-2 w-8 bg-yellow-DEFAULT rounded-full"></div>
          <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <FeatureItem 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCrm30sWovZEb7JNN5jPpsbdDK7pydlW9ikweCkCyY3LK5n6FCJul6vssBzmIALDbNPMkPrKfiarg7cTflk1lOI61ESHVztuJ5Lm7F0ugY5TShJObSXK9h-c4md0NrESYXcxg7TM3v9G9wX9FHeYhWZGH-77cHU4UGYFn4mTIIVLX7-_Px1kJXpsMKNZrHLox8HY-eSMhi3iLB1F41V5loWTyW7CR4edx5ayCvR0Jh7bh76wPeYEzvZmoS_dKwuNZ3GiZJnLVxA1BE"
            label="行业资讯"
            bgColor="bg-orange-50"
          />
          <FeatureItem 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuChy_B2pkfRGwQ-KmyQQMTN4v-9hYuVhyz_j4-idrgJCxyzxpOZ0eu5MERwLS4_sWCfa3YJMyyvwWHd27r3nGSoec_tRhttyJyWodp-sXMxnZIMEkNHaeuZ5F1ZQRselcQJv3Nvv5kVacHztl-qdbVcy62C7ILOUZgnhWY-bjEdYdb2nGv3l59ulo7LR4u2h5zBS1rF2xGXP6lzTkfyT685tM4PbzA7ICkzu6O3uzyu_PJPDbFfD0dCWV28zlpsGtUPOTiKkGPPQTA"
            label="专业讨论"
            bgColor="bg-blue-50"
          />
          <FeatureItem 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBOwHXn6ARbmCeAUtbQmA2SpWBKIifepOxWbye3eL0F50OmWQPVnKZFbgsjUCWjhXt0j05Rv-ZAzQd-S71W1rKGAtioivPnpKx_W5NYQ7B3oWzK5R5RN9sxihCXLOle9FTcqND-jTFBgsjWFUCldTd28pMrL__1l4pOYPNvK2I_mjNMPQbmsOILFXy4KKgmrJCo6u4DZU0ZCRMc2VPpQUXGJcTKw6htdCZjv-_cP568suTuzN75cIU7SFnnf7MlrDM2QvH9j8E4Erc"
            label="精英社交"
            bgColor="bg-green-50"
          />
        </div>

        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <div className="w-full space-y-5 mb-8">
          <button 
            onClick={() => onNavigate(View.LOGIN)}
            className="w-full bg-yellow-DEFAULT hover:bg-yellow-hover text-black font-bold py-4 rounded-2xl shadow-glow transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>开启探索</span>
            <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            已有账号？ 
            <button 
              onClick={() => onNavigate(View.LOGIN)}
              className="text-yellow-DEFAULT font-bold hover:underline decoration-2 underline-offset-2 ml-1"
            >
              登录
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ image, label, bgColor }: { image: string, label: string, bgColor: string }) => (
  <div className="flex flex-col items-center group cursor-pointer">
    <div className={`w-20 h-20 rounded-2xl ${bgColor} dark:bg-gray-800 mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center relative`}>
      <img src={image} alt={label} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
    </div>
    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{label}</span>
  </div>
);

export default Welcome;