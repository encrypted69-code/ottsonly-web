import Icon from '../../../components/AppIcon';


export default function ActionCard({ icon: Icon, title, description, bgColor, iconColor, borderColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${bgColor} border-2 ${borderColor} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`p-4 bg-white rounded-full mb-4 ${iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}