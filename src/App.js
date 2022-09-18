//import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import MonthGrid from "./components/Month";
import MonthNote from "./components/MonthNote";

function App() {
	let currentDate = new Date();
	const [monthDate, setMonthDate] = useState(
		new Date(
			`${currentDate.getFullYear()}-${
				currentDate.getMonth() + 1 >= 10
					? currentDate.getMonth() + 1
					: "0" + (currentDate.getMonth() + 1)
			}-01T00:00:00.000Z`
		)
	);
	const [monthNotes, setMonthNotes] = useState([]);
	const [noteId, setNoteId] = useState("");

	useEffect(() => {
		async function fetchData() {
			let startDate = new Date(monthDate.getTime());
			while (startDate.getDay() !== 1) {
				startDate.setDate(startDate.getDate() - 1);
			}
			let endDate = new Date(monthDate.getTime());
			endDate.setMonth(endDate.getMonth() + 1);
			endDate.setDate(endDate.getDate() - 1);
			while (endDate.getDay() !== 0) {
				endDate.setDate(endDate.getDate() + 1);
			}

			const response = await fetch(`http://localhost:5000/note`);
			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			const notes = await response.json();

			let _monthNotes = [];
			let iDate = new Date(startDate.getTime());
			while (iDate <= endDate) {
				let result = notes.filter((obj) => {
					return obj._id === iDate.toISOString();
				});
				if (result.length === 0) {
					_monthNotes.push({
						_id: iDate.toISOString(),
						content: "",
						tags: [],
					});
				} else {
					_monthNotes.push(result[0]);
				}
				iDate.setDate(iDate.getDate() + 1);
			}
			setMonthNotes(_monthNotes);
		}

		fetchData();

		return;
	}, []);

	const daySelect = (id) => {
		setNoteId(id);
	};

	const writeNote = async () => {
		let noteObject = {
			_id: noteId,
			content: document.getElementById("content").value,
		};

		await fetch("http://localhost:5000/note/write", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(noteObject),
		}).catch((error) => {
			window.alert(error);
			return;
		});
	};

	if (monthNotes.length === 0) {
		return <h1>One Dae Note</h1>;
	} else {
		return (
			<div className="App">
				<div className="note">
					<div>{noteId}</div>
					<textarea id="content"></textarea>
					<input type="button" value="button" onClick={writeNote} />
				</div>
				<div className="month">
					<MonthGrid notes={monthNotes} daySelect={daySelect} />
				</div>
			</div>
		);
	}
}

export default App;
