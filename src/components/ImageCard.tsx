import React, { FC } from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Image } from '../admin-store';
import { format } from '../utils/dateUtils';

interface ImageCardProps {
  image: Image;
  onEdit: (image: Image) => void;
  onDelete: (id: string) => void;
}

const ImageCard: FC<ImageCardProps> = ({ image, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100 h-48">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=صورة';
          }}
        />

        {/* Action Buttons Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(image)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="تعديل الصورة"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
                  onDelete(image.id);
                }
              }}
              className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="حذف الصورة"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{image.title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{image.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(image.uploadDate)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(image)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              تعديل
            </button>
            <span>|</span>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
                  onDelete(image.id);
                }
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
