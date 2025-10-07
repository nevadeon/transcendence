import { useEffect, useRef } from 'react';

type SendInputFn = (direction: 'up' | 'down', action: 'start' | 'stop', padId: number) => void;

const CONTROL_MAP: { [key: string]: { padId: number, direction: 'up' | 'down' } } = {
    // J1
    'q': { padId: 1, direction: 'up' },
    'a': { padId: 1, direction: 'down' },
    // J2
    'f': { padId: 2, direction: 'up' },
    'v': { padId: 2, direction: 'down' },
	// J3
    'k': { padId: 3, direction: 'up' },
    'm': { padId: 3, direction: 'down' },
	// J4
    '\'': { padId: 4, direction: 'up' },
    ']': { padId: 4, direction: 'down' },
};


export const useGameControls = (sendInput: SendInputFn) => {
    const keysPressed = useRef(new Set<string>());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const control = CONTROL_MAP[key];

            if (control && !keysPressed.current.has(key)) {
                event.preventDefault();
                keysPressed.current.add(key);
                // 'q': ('up', 'start', 1) = key pressed au server
                sendInput(control.direction, 'start', control.padId);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const control = CONTROL_MAP[key];

            if (control) {
                event.preventDefault();
                keysPressed.current.delete(key);
                // Envoie l'action 'stop' (touche relâchée) au serveur
                sendInput(control.direction, 'stop', control.padId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            keysPressed.current.forEach(key => {
                const control = CONTROL_MAP[key];
                if (control)
					sendInput(control.direction, 'stop', control.padId);
            });
        };
    }, [sendInput]);
};
