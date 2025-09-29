export default function UserProfilePage() {
  const user = {
    name: '',
    email: '',
    bio: '',
    avatar: '/file.svg',
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-gray-300"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-medium leading-tight text-gray-900">
              {user.name || 'User Name'}
            </h1>
            <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
            <p className="mt-1 text-xs text-gray-600">{user.bio || 'Bio description'}</p>
          </div>
          <div className="ml-auto">
            <button className="inline-flex items-center px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Courses</div>
            <div className="text-sm font-medium text-gray-900">0</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Followers</div>
            <div className="text-sm font-medium text-gray-900">0</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Following</div>
            <div className="text-sm font-medium text-gray-900">0</div>
          </div>
        </div>
      </div>
    </main>
  );
}