import MonthNote from "./MonthNote";
import styles from "./Month.module.css";

const MonthGrid = (props) => {

    const notes = props.notes;

    return (
        <div className={styles.month_grid}>
            <div className={styles.head_block}><div>Monday</div></div>
            <div className={styles.head_block}><div>Tuesday</div></div>
            <div className={styles.head_block}><div>Wednesday</div></div>
            <div className={styles.head_block}><div>Thursday</div></div>
            <div className={styles.head_block}><div>Friday</div></div>
            <div className={styles.head_block}><div>Saturday</div></div>
            <div className={styles.head_block}><div>Sunday</div></div>
            {notes.map((el) => <MonthNote key={el._id} {...el} daySelect={props.daySelect}/>)}
        </div>
    )
}

export default MonthGrid;