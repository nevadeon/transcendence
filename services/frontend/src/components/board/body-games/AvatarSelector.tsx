import { useState } from "react";
import { useAuth } from "../../../contexts/auth/useAuth";
import "../../../styles/board/sidebar-user/AvatarSelector.css";

const DEFAULT_AVATARS = [
    'rick.png',
    'morty.png',
    'summer.png',
    'rockRick.png',
    'spaceMorty.png',
    'spaceBess.png',
];
const BASE_AVATAR_PATH = '/avatars/defaults/';

export default function AvatarSelector() {
	const { user, token, updateUser } = useAuth();
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(user.avatar);
    const [isLoading, setIsLoading] = useState(false);

	const handleAvatarChange = async (newFile: string) => {
        if (newFile === selectedAvatarFile || isLoading) return;
        setIsLoading(true);
        const newAvatarDbPath = 'defaults/' + newFile;
        try {
            const res = await fetch(`http://localhost:3001/users/${user.id}/avatar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    avatar: newAvatarDbPath
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erreur inconnue lors de la mise à jour.");
            }
            setSelectedAvatarFile(BASE_AVATAR_PATH + newFile);
            if (updateUser)
                updateUser({ avatar: newAvatarDbPath });
        } catch (err) {
            console.error('Erreur API:', err);
        } finally {
            setIsLoading(false);
        }
    };

	return (
		<div className="avatar-container">
			<img src={user.avatar ? user.avatar : "/avatars/defaults/rick.png"} alt="Avatar Profile" className="profile-data-portrait" />
			<div className="avatar-selector">
                {DEFAULT_AVATARS.map((file) => {
                    const avatarPath = BASE_AVATAR_PATH + file;
                    const isActive = avatarPath === selectedAvatarFile;
                    return (
                        <div
                            key={file}
                            className={ isActive ? 'active' : '' }
                            onClick={() => handleAvatarChange(file)}
                        >
                            <img className="avatarMiniature"
                                src={avatarPath}
                                alt={`Miniature ${file.split('.')[0]}`}
                            />
                        </div>
                    );
                })}
            </div>
		</div>
	);
}