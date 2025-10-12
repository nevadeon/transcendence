<<<<<<< HEAD
// import { useContext } from "react";
// import { TournamentContext } from "./TournamentContext";

// export default function useTournament() {
// 	const ctx = useContext(TournamentContext);
// 	if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
// 	return ctx;
// }
=======
import { useContext } from "react";
import { TournamentContext } from "./TournamentContext";

export default function useTournament() {
	const ctx = useContext(TournamentContext);
	if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
	return ctx;
}
>>>>>>> 713e6c0 (added tournament context functions, still need to fix possibly null values)
