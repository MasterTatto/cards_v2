import React, {useEffect, useState} from 'react';
import styles from './TableCards.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../n1-main/m2-bll/store";
import {
    CardType,
    deleteCardItemTC,
    GetCardsType,
    setChangeSortCards,
    updateCardItemTC
} from "../c2-bll/cardsReducer";
import Modal, {ModalTypeAction} from "../../../n1-main/m1-ui/common/modal";

const header = ['Question', 'Last Update', 'Grade', 'Actions']

const TableCards = () => {
    const dispatch = useDispatch()
    const rows = useSelector<AppRootStateType, GetCardsType | null>((state) => state.cards.cards)
    const sortCards = useSelector<AppRootStateType, number>((state) => state.cards.sortByCards)
    const profileID = useSelector<AppRootStateType, string>((state) => state.login.profileData._id)
    const [nameHeader, setNameHeader] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [type, setType] = useState<ModalTypeAction>('')
    const [cardID, setCardID] = useState('')
    const [answer, setAnswer] = useState('')

    useEffect(() => {
        const scrollContainer = document.querySelectorAll("#table");

        scrollContainer.forEach((el) => {
            el.addEventListener("wheel", (evt: any) => {
                evt.preventDefault();
                el.scrollLeft += evt.deltaY;
            });
        })
        return () => {
            scrollContainer.forEach((el) => {
                el.removeEventListener("wheel", (evt: any) => {
                    evt.preventDefault();
                    el.scrollLeft += evt.deltaY;
                });
            })
        }
    });


    const changeSortCards = (name: string) => {
        const nameClick = name === 'Grade' ? 'grade' : 'updated'
        if (name === 'Last Update' || name === 'Grade') {
            if (sortCards === 0) {
                dispatch(setChangeSortCards(1, nameClick))
            } else {
                dispatch(setChangeSortCards(0, nameClick))
            }
        }
        setNameHeader(name)
    }

    const changeStyleSortCard =
        ((nameHeader === 'Grade' && sortCards !== 0) && styles.activeGrade) ||
        ((nameHeader === 'Last Update' && sortCards !== 0) && styles.activeUpdate)

    const updateCardPack = (value?: string) => {
        //@ts-ignore
        type === 'editItem' && dispatch(updateCardItemTC(value, cardID))
        type === 'deleteItem' && dispatch(deleteCardItemTC(cardID))
    }
    const buttonHandler = (id: string, type: ModalTypeAction) => {
        setCardID(id)
        setType(type)
        setOpenModal(true)
    }

    return (
        <table className={styles.table}>
            <Modal openModal={openModal} setOpenModal={setOpenModal} setActionTC={updateCardPack} type={type}
                   answer={answer}/>
            <thead className={styles.thead}>

            {header.map(headerGroup => (
                <tr className={`${styles.tableHeader} ${changeStyleSortCard}`}
                    key={headerGroup}
                    onClick={() => {
                        changeSortCards(headerGroup)
                    }}>
                    <th className={styles.column}>
                        {headerGroup}
                    </th>
                </tr>
            ))}
            </thead>

            <tbody className={styles.rows}>

            {rows?.cards.map((row: CardType) => {
                return (
                    <tr className={styles.rowe} key={row._id}>
                        <td className={styles.row}>

                            <span className={styles.rowItem} id={'table'}>{row.question}</span>
                            <span className={styles.rowItem} id={'table'}>{row.updated.slice(0, 10)}</span>
                            <span className={styles.rowItem} id={'table'}> {row.grade}</span>

                            <div className={`${styles.rowItem} ${styles.btnBox}`}>
                                {profileID === row.user_id &&
                                (<>
                                    <span className={styles.btn} data-color
                                          onClick={buttonHandler.bind(null, row._id, 'deleteItem')}>Delete</span>
                                    <span className={styles.btn}
                                          onClick={buttonHandler.bind(null, row._id, 'editItem')}>Edit</span>
                                </>)
                                }
                                <span className={styles.btn}
                                      onClick={() => {
                                          setType('answer')
                                          setAnswer(row.answer)
                                          setOpenModal(true)
                                      }}>Answer</span>
                            </div>

                        </td>
                    </tr>
                )
            })}

            </tbody>
        </table>
    );
};

export default TableCards;
