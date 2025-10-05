import React, { useState, useEffect } from 'react';
import WarningSrc from "../../assets/icons/warning.svg";

interface ValidationMsgProps {
    type: 'success' | 'error' | 'info';
    message: string;
}

const API_BASE_URL = 'http://localhost:3001/api/user/2fa';

export default function TwoFactorSetup(props: any) {
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [qrCodeData, setQrCodeData] = useState<string>("");
    const [setupToken, setSetupToken] = useState<string>("");
    const [validationMsg, setValidationMsg] = useState<ValidationMsgProps | null>(null);
    const [isSettingUp, setIsSettingUp] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
	const { token, profile, onClickOpen, onClickCancel } = props;

    useEffect(() => {
		const load2FAStatus = async () => {
			if (!token) return;
			const url = `${API_BASE_URL}/status`;
			try {
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					}
				});
				const data = await res.json();
				if (res.ok) {
					setIs2FAEnabled(data.is_2fa_enabled);
				} else {
					console.error("Erreur de statut 2FA:", data.message);
				}
			} catch (err) {
				console.error('Failed to fetch 2FA status: ', err);
			}
    	};
    	load2FAStatus();
	}, []);


    /**
     * Gère la bascule du checkbox ON/OFF.
     * Si l'utilisateur active (ON), nous lançons l'appel au toggle.
     * Le backend (Route 3) déterminera si le secret est déjà stocké.
     */
    const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        if (!token) {
            setValidationMsg({ type: 'error', message: "Veuillez vous reconnecter." });
            return;
        }
        // Si l'utilisateur désactive (OFF) ou tente d'activer
        setIsLoading(true);
        setValidationMsg(null);
        try {
            const res = await fetch(`${API_BASE_URL}/toggle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ two_factor: checked }),
            });
            const data = await res.json();
            if (res.ok) {
                setIs2FAEnabled(data.is_2fa_enabled === 1); //true or false
                // Si la désactivation est réussie, on nettoie le setup en cours
                if (!checked) {
                    setIsSettingUp(false);
                    setQrCodeData("");
                }
                setValidationMsg({ type: 'success', message: data.message });
            } else if (res.status === 400 && checked) { // 400: Secret manquant. Forcer l'enrôlement.
                setValidationMsg({
                    type: 'info',
                    message: "Veuillez scanner le QR Code et confirmer le code pour activer le 2FA."
                });
                setIsSettingUp(true);
                handleGenerateSecret();
                // Le toggle n'a pas eu lieu, la checkbox ne doit pas changer
                setIs2FAEnabled(false);
            } else {
                setValidationMsg({ type: 'error', message: data.message || "Erreur lors de la bascule." });
            }
        } catch (error) {
            console.error('Erreur réseau/API:', error);
            setValidationMsg({ type: 'error', message: "Erreur de connexion au serveur." });
        } finally {
            setIsLoading(false);
        }
    };


    /**
     * Lance l'appel pour générer le secret et afficher le QR Code (Route 1).
     * Utilisé lorsque isSettingUp est activé.
     */
    const handleGenerateSecret = async () => {
        if (!token) return;
        setIsLoading(true);
        setValidationMsg(null);
        setQrCodeData("");
        try {
            const res = await fetch(`${API_BASE_URL}/generate-secret`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setQrCodeData(data.qrCodeImage);
                setValidationMsg({
                    type: 'info',
                    message: `Scannez ce code sur votre app 2FA(ex: Google Authenticator)`
                });
                setIsSettingUp(true); // S'assurer que le mode setup est actif
            } else {
                setValidationMsg({ type: 'error', message: data.message || "Échec de la génération du QR Code." });
            }
        } catch (error) {
            setValidationMsg({ type: 'error', message: "Erreur réseau lors de la génération du secret." });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Vérifie le code TOTP soumis pour ACTIVER le 2FA (Route 2).
     */
    const handleVerifySetup = async () => {
        if (!token) return;
        setIsLoading(true);
        setValidationMsg(null);
        // Validation simple du code
        if (setupToken.length !== 6 || isNaN(parseInt(setupToken, 10))) {
            setValidationMsg({ type: 'error', message: "Veuillez entrer un code à 6 chiffres valide." });
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/verify-setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ token: setupToken }),
            });
            const data = await res.json();
            if (res.ok) {
                // Succès: 2FA est maintenant ACTIF (statut 1 dans la DB)
                setIs2FAEnabled(true);
                setIsSettingUp(false); // Quitter le mode setup
                setQrCodeData(""); // Cacher le QR Code
                setSetupToken(""); // Vider l'input
                setValidationMsg({ type: 'success', message: data.message });
            } else {
                setValidationMsg({ type: 'error', message: data.message || "Vérification échouée. Code incorrect ou expiré." });
            }
        } catch (error) {
            setValidationMsg({ type: 'error', message: "Erreur réseau lors de la vérification." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={isSettingUp ? "twofa-container" : ""}>
            {validationMsg && (
                <div className="field" style={{ position: 'relative' }}>
                    <img className="field-icon" src={WarningSrc} alt="Warning Icon" />
                    <span className="field-msg">{validationMsg.message}</span>
                </div>
            )}
            <div className="flex justify-between items-center py-2 border-b">
                <label htmlFor="2fa-switch" className={profile ? "profile-label" : ""}>
                    2FA STATUS :
                    <span style={{marginLeft: '8px'}}> {is2FAEnabled ? 'ACTIVE' : 'DISABLED'} </span>
                </label>
                <div className="in-line">
                    {
                        !is2FAEnabled && !isSettingUp && (
                        <button
                            type="button"
                            className="profile-input"
                            onClick={() => {
                                onClickOpen();
                                setIsSettingUp(true);
                                handleGenerateSecret();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'LOADING' : 'GENERATE 2FA'}
                        </button>
                    )}
                    {
                        isSettingUp && (
                            qrCodeData ? (
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1em' }}>
                                    <img
                                        src={qrCodeData}
                                        alt="QR Code 2FA"
                                        style={{ width: 128, height: 128 }}
                                    />
                                    <span className='msg-2fa' style={{ marginTop: '8px' }}>SCAN THIS QRCODE</span>
                                </div>
                                ) : (
                                <span className='msg-2fa'>
                                    {isLoading ? 'GENERATE QRCODE...' : 'CLICK ON CHECKBOX TO GENERATE THE QRCODE'}
                                </span>
                            )
                        )
                    }
                    <label htmlFor="2fa-switch" className='checkbox-2fa'>
                        <input
                            type="checkbox"
                            id="2fa-switch"
                            name="2fa-switch"
                            className='profile-input'
                            checked={is2FAEnabled}
                            onChange={handleToggle}
                            disabled={isLoading}
                        />
                    </label>
                </div>
            </div>
            {isSettingUp && (
                <div>
                    {/* {qrCodeData ? (
                        <div>
                            <img
                                src={qrCodeData}
                                alt="QR Code 2FA"
                                style={{ width: 128, height: 128 }}
                            />
                            <span className='msg-2fa'>Scannez ce code. Le secret sera activé après la vérification.</span>
                        </div>
                    ) : (
                        <span className='msg-2fa'>
                            {isLoading ? 'GENERATE QRCODE...' : 'CLICK ON CHECKBOX TO GENERATE THE QRCODE'}
                        </span>
                    )} */}
                    <div className='confirmation-2fa'>
                        <input
                            id="setup-token"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            value={setupToken}
                            onChange={(e) => setSetupToken(e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={isLoading}
                        />
                        <div style={{display: 'flex', height: '72px'}}>
                            <button
                                type="button"
                                className="stats-btn disabled"
                                onClick={handleVerifySetup}
                                disabled={isLoading || setupToken.length !== 6}
                            >
                                CONFIRM
                            </button>
                            {isSettingUp && (
                                <button
                                    type="button"
                                    className="logout-btn cancel"
                                    onClick={() => {
                                        onClickCancel();
                                        setIsSettingUp(false);
                                        setQrCodeData("");
                                        setValidationMsg(null);
                                        setSetupToken("");
                                    }}
                                    disabled={isLoading}
                                >
                                    CANCEL
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};