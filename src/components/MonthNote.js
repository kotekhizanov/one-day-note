import styles from "./MonthNote.module.css";

const MonthNote = (props) => {

    const day = new Date(props._id).getDate();
    const onClick = (e) => {
        props.daySelect(props._id);
    }
    return (
        <div className={styles.month_block} id={props._id} onClick={onClick}>
            <div>{day}</div>
            <div className={styles.content}>{props.content}</div>
        </div>
    )
}

export default MonthNote;