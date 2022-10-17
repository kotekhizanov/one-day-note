//import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import MonthGrid from "./components/Month";
import MonthNote from "./components/MonthNote";

function App() {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// function getFirstDayPreviousMonth() {
	// 	const date = new Date();
	// 	return new Date(date.getFullYear(), date.getMonth() - 1, 1);
	// }
	// let currentDate = getFirstDayPreviousMonth();
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
	const [noteDay, setNoteDay] = useState("");
	const [content, setContent] = useState("");

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

			console.log(notes);
			console.log(startDate);
			console.log(endDate);

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
			console.log(_monthNotes);
			setMonthNotes(_monthNotes);

			// setNoteId(
			// 	`${currentDate.getFullYear()}-${
			// 		currentDate.getMonth() + 1 >= 10
			// 			? currentDate.getMonth() + 1
			// 			: "0" + (currentDate.getMonth() + 1)
			// 	}-${currentDate.getDate()}T00:00:00.000Z`
			// );
		}

		fetchData();

		return;
	}, [monthDate]);

	const daySelect = (id) => {
		writeNote();
		setNoteId(id);
	};

	useEffect(() => {
		let noteDayDate = new Date(noteId);
		setNoteDay(
			`${noteDayDate.getDate()} ${
				noteDayDate.getMonth() + 1
			} ${noteDayDate.getFullYear()}`
		);
		const foundElement = monthNotes.find((element) => element._id === noteId);
		if (foundElement) {
			setContent(foundElement.content);
			document.getElementById("content").focus();
		}
	}, [noteId]);

	const contentOnChangeHandler = (element) => {
		setContent(element.target.value);
	};

	useEffect(() => {
		const _monthNotes = [...monthNotes];
		const foundElement = _monthNotes.find((element) => element._id === noteId);
		if (foundElement) {
			foundElement.content = content;
		}

		setMonthNotes(_monthNotes);

		const identifier = setTimeout(() => {
			writeNote();
			console.log("write");
		}, 2000);

		return () => {
			clearTimeout(identifier);
		};
	}, [content]);

	const writeNote = async () => {
		let noteObject = {
			_id: noteId,
			content: content,
		};

		await fetch("http://localhost:5000/note/write", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(noteObject),
		})
			.catch((error) => {
				window.alert(error);
				return;
			})
			.then(console.log("write end"));
	};

	const arrowLeftClickHandler = () => {
		setMonthDate((monthDate) => {
			return new Date(monthDate.setMonth(monthDate.getMonth() - 1));
		});
	};

	const arrowRightClickHandler = () => {
		setMonthDate((monthDate) => {
			return new Date(monthDate.setMonth(monthDate.getMonth() + 1));
		});
	};

	if (monthNotes.length === 0) {
		return <h1>One Day Note</h1>;
	} else {
		return (
			<div className="App">
				<div className="month">
					<div className="month-navigation">
						<div className="month-navigation-arrow" onClick={arrowLeftClickHandler}>&lt;&lt;</div>
						<div className="month-navigation-text">{monthNames[monthDate.getMonth()]}</div>
						<div className="month-navigation-arrow" onClick={arrowRightClickHandler}>&gt;&gt;</div>
					</div>
					<MonthGrid notes={monthNotes} daySelect={daySelect} />
				</div>
				<div className="note">
					<div className="note_date">{noteDay}</div>
					<textarea
						id="content"
						onChange={contentOnChangeHandler}
						value={content}
						placeholder="Write about your day here..."
					></textarea>
					<input type="button" value="button" onClick={writeNote} />
				</div>
			</div>
		);
	}
}

export default App;
