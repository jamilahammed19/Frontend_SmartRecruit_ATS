export default function ProfileHeader({ profile, personalInfo, isUploadingPhoto, onPhotoUpload }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {/* Avatar Upload Circle */}
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md group flex-shrink-0">
                {isUploadingPhoto ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-xs font-medium text-slate-500 animate-pulse">Uploading...</span>
                    </div>
                ) : profile?.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                )}

                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">Change</span>
                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={onPhotoUpload} disabled={isUploadingPhoto} />
                </label>
            </div>

            {/* Candidate Name & Email */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">
                    {personalInfo?.full_name || "Your Full Name"}
                </h2>
                <p className="text-slate-500 font-medium mt-1">
                    {profile?.verified_email}
                </p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-100 inline-block px-2 py-1 rounded">
                    Candidate Dashboard
                </p>
            </div>
        </div>
    );
}