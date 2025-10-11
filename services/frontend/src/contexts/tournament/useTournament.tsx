import { useContext } from "react";
import { TournamentContext } from "./TournamentContext";

export default function useTournament() {
	const ctx = useContext(TournamentContext);
	if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
	return ctx;
}
